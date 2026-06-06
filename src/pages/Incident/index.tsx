import { useState } from 'react';
import { AlertCircle, Plus, Eye, User, Calendar, Clock, FileText, MapPin } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { useStore } from '@/store';
import type { Incident, DutyRecord } from '@/types';

type TabType = 'incidents' | 'duty';

const incidentCategories = [
  { value: '设备故障', label: '设备故障' },
  { value: '仪表故障', label: '仪表故障' },
  { value: '违规操作', label: '违规操作' },
  { value: '其他', label: '其他' },
];

const shiftOptions = [
  { value: '白班', label: '白班' },
  { value: '夜班', label: '夜班' },
  { value: '中班', label: '中班' },
];

export default function Incident() {
  const { state, dispatch, generateId, getCurrentTime } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('incidents');

  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    enterpriseId: '',
    location: '',
    category: '',
    description: '',
    causeAnalysis: '',
    measures: '',
    reporter: '',
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [dutyModalOpen, setDutyModalOpen] = useState(false);
  const [dutyForm, setDutyForm] = useState({
    date: '',
    shift: '',
    dutyPerson: '',
    nextDutyPerson: '',
    handoverContent: '',
  });

  const openIncidentModal = () => {
    setIncidentForm({
      enterpriseId: '',
      location: '',
      category: '',
      description: '',
      causeAnalysis: '',
      measures: '',
      reporter: '',
    });
    setIncidentModalOpen(true);
  };

  const saveIncident = () => {
    if (!incidentForm.enterpriseId || !incidentForm.location || !incidentForm.category ||
        !incidentForm.description || !incidentForm.reporter) {
      return;
    }

    const enterprise = state.enterprises.find((e) => e.id === incidentForm.enterpriseId);
    if (!enterprise) return;

    const newIncident: Incident = {
      id: generateId('inc'),
      enterpriseId: incidentForm.enterpriseId,
      enterpriseName: enterprise.name,
      title: `${incidentForm.category} - ${incidentForm.location}`,
      category: incidentForm.category,
      date: getCurrentTime().split(' ')[0],
      location: incidentForm.location,
      description: incidentForm.description,
      causeAnalysis: incidentForm.causeAnalysis,
      measures: incidentForm.measures,
      reporter: incidentForm.reporter,
      status: 'reported',
    };
    dispatch({ type: 'ADD_INCIDENT', payload: newIncident });
    setIncidentModalOpen(false);
  };

  const openDetailModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setDetailModalOpen(true);
  };

  const openDutyModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setDutyForm({
      date: today,
      shift: '',
      dutyPerson: '',
      nextDutyPerson: '',
      handoverContent: '',
    });
    setDutyModalOpen(true);
  };

  const saveDutyRecord = () => {
    if (!dutyForm.date || !dutyForm.shift || !dutyForm.dutyPerson ||
        !dutyForm.nextDutyPerson || !dutyForm.handoverContent) {
      return;
    }

    const newDutyRecord: DutyRecord = {
      id: generateId('duty'),
      date: dutyForm.date,
      shift: dutyForm.shift,
      dutyPerson: dutyForm.dutyPerson,
      nextDutyPerson: dutyForm.nextDutyPerson,
      handoverContent: dutyForm.handoverContent,
      handoverTime: getCurrentTime(),
    };
    dispatch({ type: 'ADD_DUTY_RECORD', payload: newDutyRecord });
    setDutyModalOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDuty = state.dutyRecords.find((d) => d.date === todayStr);

  return (
    <PageContainer
      title="事故苗头"
      description="事故苗头登记和值班交接管理"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-red-50 rounded-lg mr-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">苗头总数</p>
            <p className="text-xl font-bold text-slate-800">{state.incidents.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-4">
            <Clock size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">处理中</p>
            <p className="text-xl font-bold text-slate-800">
              {state.incidents.filter((i) => i.status === 'processing').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-lg mr-4">
            <FileText size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">已关闭</p>
            <p className="text-xl font-bold text-slate-800">
              {state.incidents.filter((i) => i.status === 'closed').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">今日值班</p>
            <p className="text-xl font-bold text-slate-800">
              {todayDuty?.dutyPerson || '暂无'}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-slate-200 px-5">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('incidents')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'incidents'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              事故苗头
            </button>
            <button
              onClick={() => setActiveTab('duty')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'duty'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              值班交接
            </button>
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'incidents' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">共 {state.incidents.length} 条记录</span>
                <button onClick={openIncidentModal} className="btn btn-primary flex items-center">
                  <Plus size={16} className="mr-1" />
                  新增登记
                </button>
              </div>
              <div className="space-y-4">
                {state.incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-5 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-slate-800">{incident.title}</h4>
                          <StatusBadge status={incident.status} />
                          <span className="badge bg-slate-100 text-slate-600">
                            {incident.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center">
                            <User size={14} className="mr-1" />
                            {incident.enterpriseName}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {incident.date}
                          </span>
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {incident.location}
                          </span>
                          <span>上报人：{incident.reporter}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">事件描述</p>
                            <p className="text-sm text-slate-700 line-clamp-2">{incident.description}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">原因分析</p>
                            <p className="text-sm text-slate-700 line-clamp-2">{incident.causeAnalysis || '暂无'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">防范措施</p>
                            <p className="text-sm text-slate-700 line-clamp-2">{incident.measures || '暂无'}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openDetailModal(incident)}
                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                      >
                        <Eye size={14} className="mr-1" />
                        查看详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'duty' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">共 {state.dutyRecords.length} 条记录</span>
                <button onClick={openDutyModal} className="btn btn-primary flex items-center">
                  <Plus size={16} className="mr-1" />
                  新增交接
                </button>
              </div>
              <div className="space-y-4">
                {state.dutyRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-5 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="badge bg-primary-100 text-primary-800">
                          {record.shift}
                        </span>
                        <span className="text-sm text-slate-500">{record.date}</span>
                      </div>
                      <span className="text-sm text-slate-500">
                        交接时间：{record.handoverTime}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">值班人员</p>
                        <p className="text-sm font-medium text-slate-800">{record.dutyPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">接班人员</p>
                        <p className="text-sm font-medium text-slate-800">{record.nextDutyPerson}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-slate-500 mb-1">交接内容</p>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                        {record.handoverContent}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        title="新增事故苗头登记"
        size="lg"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setIncidentModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={saveIncident} className="btn btn-primary">提交</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">所属企业</label>
              <select
                className="input"
                value={incidentForm.enterpriseId}
                onChange={(e) => setIncidentForm({ ...incidentForm, enterpriseId: e.target.value })}
              >
                <option value="">请选择企业</option>
                {state.enterprises.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">地点</label>
              <input
                type="text"
                className="input"
                value={incidentForm.location}
                onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                placeholder="请输入地点"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">类别</label>
              <select
                className="input"
                value={incidentForm.category}
                onChange={(e) => setIncidentForm({ ...incidentForm, category: e.target.value })}
              >
                <option value="">请选择类别</option>
                {incidentCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">上报人</label>
              <input
                type="text"
                className="input"
                value={incidentForm.reporter}
                onChange={(e) => setIncidentForm({ ...incidentForm, reporter: e.target.value })}
                placeholder="请输入上报人姓名"
              />
            </div>
          </div>
          <div>
            <label className="label">描述</label>
            <textarea
              className="input"
              rows={3}
              value={incidentForm.description}
              onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
              placeholder="请详细描述事故苗头情况..."
            />
          </div>
          <div>
            <label className="label">原因分析</label>
            <textarea
              className="input"
              rows={2}
              value={incidentForm.causeAnalysis}
              onChange={(e) => setIncidentForm({ ...incidentForm, causeAnalysis: e.target.value })}
              placeholder="请分析事故原因（可选）"
            />
          </div>
          <div>
            <label className="label">防范措施</label>
            <textarea
              className="input"
              rows={2}
              value={incidentForm.measures}
              onChange={(e) => setIncidentForm({ ...incidentForm, measures: e.target.value })}
              placeholder="请提出防范措施（可选）"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="事故苗头详情"
        size="lg"
        footer={
          <button onClick={() => setDetailModalOpen(false)} className="btn btn-primary">关闭</button>
        }
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-slate-800">{selectedIncident.title}</h3>
              <StatusBadge status={selectedIncident.status} />
              <span className="badge bg-slate-100 text-slate-600">
                {selectedIncident.category}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">所属企业</p>
                <p className="text-slate-700">{selectedIncident.enterpriseName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">地点</p>
                <p className="text-slate-700">{selectedIncident.location}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">发生日期</p>
                <p className="text-slate-700">{selectedIncident.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">上报人</p>
                <p className="text-slate-700">{selectedIncident.reporter}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-2">事件描述</p>
              <p className="text-slate-700">{selectedIncident.description}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-700 mb-2 font-medium">原因分析</p>
              <p className="text-amber-800">{selectedIncident.causeAnalysis || '暂无'}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-700 mb-2 font-medium">防范措施</p>
              <p className="text-emerald-800">{selectedIncident.measures || '暂无'}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={dutyModalOpen}
        onClose={() => setDutyModalOpen(false)}
        title="新增值班交接"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setDutyModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={saveDutyRecord} className="btn btn-primary">提交</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">日期</label>
              <input
                type="date"
                className="input"
                value={dutyForm.date}
                onChange={(e) => setDutyForm({ ...dutyForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">班次</label>
              <select
                className="input"
                value={dutyForm.shift}
                onChange={(e) => setDutyForm({ ...dutyForm, shift: e.target.value })}
              >
                <option value="">请选择班次</option>
                {shiftOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">值班人</label>
              <input
                type="text"
                className="input"
                value={dutyForm.dutyPerson}
                onChange={(e) => setDutyForm({ ...dutyForm, dutyPerson: e.target.value })}
                placeholder="请输入值班人姓名"
              />
            </div>
            <div>
              <label className="label">接班人</label>
              <input
                type="text"
                className="input"
                value={dutyForm.nextDutyPerson}
                onChange={(e) => setDutyForm({ ...dutyForm, nextDutyPerson: e.target.value })}
                placeholder="请输入接班人姓名"
              />
            </div>
          </div>
          <div>
            <label className="label">交接内容</label>
            <textarea
              className="input"
              rows={4}
              value={dutyForm.handoverContent}
              onChange={(e) => setDutyForm({ ...dutyForm, handoverContent: e.target.value })}
              placeholder="请详细描述交接内容..."
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
