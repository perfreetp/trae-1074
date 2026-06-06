import { useState } from 'react';
import { MapPin, AlertTriangle, Plus, Eye, Edit } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import { useStore } from '@/store';
import { getHazardLevelColor, getHazardLevelText } from '@/utils';
import type { HazardSource } from '@/types';

export default function RiskSource() {
  const { state, dispatch, generateId, getCurrentTime } = useStore();
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEditMode, setDetailEditMode] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<HazardSource | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ source: HazardSource; newStatus: string } | null>(null);
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [statusChangeRequirements, setStatusChangeRequirements] = useState('');
  const [statusChangeFromDetail, setStatusChangeFromDetail] = useState(false);
  const [formData, setFormData] = useState({
    enterpriseId: '',
    name: '',
    type: '',
    level: 'three' as 'one' | 'two' | 'three' | 'four',
    location: '',
    status: 'normal' as 'normal' | 'warning' | 'danger',
    controlMeasures: '',
    lng: 116.4 + (Math.random() - 0.5) * 0.1,
    lat: 39.915 + (Math.random() - 0.5) * 0.1,
  });

  const filteredSources = state.hazardSources.filter((h) => {
    const matchLevel = levelFilter === 'all' || h.level === levelFilter;
    const matchStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchLevel && matchStatus;
  });

  const getMapPosition = (lng: number, lat: number) => {
    const baseX = 116.4;
    const baseY = 39.915;
    const x = (lng - baseX) * 5000 + 50;
    const y = (baseY - lat) * 5000 + 50;
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  };

  const resetForm = () => {
    setFormData({
      enterpriseId: '',
      name: '',
      type: '',
      level: 'three',
      location: '',
      status: 'normal',
      controlMeasures: '',
      lng: 116.4 + (Math.random() - 0.5) * 0.1,
      lat: 39.915 + (Math.random() - 0.5) * 0.1,
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const handleViewDetail = (source: HazardSource) => {
    setSelectedSource(source);
    setDetailEditMode(false);
    setFormData({
      enterpriseId: source.enterpriseId,
      name: source.name,
      type: source.type,
      level: source.level,
      location: source.location,
      status: source.status,
      controlMeasures: source.controlMeasures,
      lng: source.lng || 116.4 + (Math.random() - 0.5) * 0.1,
      lat: source.lat || 39.915 + (Math.random() - 0.5) * 0.1,
    });
    setDetailModalOpen(true);
  };

  const handleEdit = (source: HazardSource) => {
    setSelectedSource(source);
    setFormData({
      enterpriseId: source.enterpriseId,
      name: source.name,
      type: source.type,
      level: source.level,
      location: source.location,
      status: source.status,
      controlMeasures: source.controlMeasures,
      lng: source.lng || 116.4 + (Math.random() - 0.5) * 0.1,
      lat: source.lat || 39.915 + (Math.random() - 0.5) * 0.1,
    });
    setEditModalOpen(true);
  };

  const submitCreate = () => {
    if (!formData.enterpriseId || !formData.name || !formData.type || !formData.location) return;

    const enterprise = state.enterprises.find((e) => e.id === formData.enterpriseId);
    const newSource: HazardSource = {
      id: generateId('hs'),
      enterpriseId: formData.enterpriseId,
      enterpriseName: enterprise?.name || '',
      name: formData.name,
      type: formData.type,
      level: formData.level,
      location: formData.location,
      status: formData.status,
      controlMeasures: formData.controlMeasures,
      lng: formData.lng,
      lat: formData.lat,
    };

    dispatch({ type: 'ADD_HAZARD_SOURCE', payload: newSource });
    setCreateModalOpen(false);
    resetForm();
  };

  const submitEdit = () => {
    if (!selectedSource || !formData.enterpriseId || !formData.name || !formData.type || !formData.location) return;

    if (formData.status !== selectedSource.status && (formData.status === 'warning' || formData.status === 'danger')) {
      setPendingStatusChange({ source: selectedSource, newStatus: formData.status });
      setStatusChangeReason('');
      setStatusChangeRequirements('');
      setStatusChangeFromDetail(false);
      return;
    }

    const enterprise = state.enterprises.find((e) => e.id === formData.enterpriseId);
    const updatedSource: any = {
      ...selectedSource,
      enterpriseId: formData.enterpriseId,
      enterpriseName: enterprise?.name || selectedSource.enterpriseName,
      name: formData.name,
      type: formData.type,
      level: formData.level,
      location: formData.location,
      status: formData.status,
      controlMeasures: formData.controlMeasures,
      lng: formData.lng,
      lat: formData.lat,
    };

    if (formData.status !== selectedSource.status) {
      updatedSource.statusHistory = [...(selectedSource.statusHistory || []), {
        fromStatus: selectedSource.status,
        toStatus: formData.status,
        changeTime: getCurrentTime(),
      }];
    }

    dispatch({ type: 'UPDATE_HAZARD_SOURCE', payload: updatedSource });
    setEditModalOpen(false);
    setSelectedSource(null);
    resetForm();
  };

  const confirmStatusChange = () => {
    if (!pendingStatusChange) return;
    const { source, newStatus } = pendingStatusChange;
    const enterprise = state.enterprises.find((e) => e.id === formData.enterpriseId);

    const historyRecord = {
      fromStatus: source.status,
      toStatus: newStatus,
      changeTime: getCurrentTime(),
      reason: statusChangeReason,
      requirements: statusChangeRequirements,
    };

    const updatedSource: any = {
      ...source,
      enterpriseId: formData.enterpriseId,
      enterpriseName: enterprise?.name || source.enterpriseName,
      name: formData.name,
      type: formData.type,
      level: formData.level,
      location: formData.location,
      status: newStatus,
      controlMeasures: formData.controlMeasures,
      lng: formData.lng,
      lat: formData.lat,
      statusHistory: [...(source.statusHistory || []), historyRecord],
    };

    dispatch({ type: 'UPDATE_HAZARD_SOURCE', payload: updatedSource });

    if (statusChangeFromDetail) {
      setSelectedSource(updatedSource);
      setDetailEditMode(false);
    } else {
      setEditModalOpen(false);
      setSelectedSource(null);
      resetForm();
    }

    setPendingStatusChange(null);
    setStatusChangeReason('');
    setStatusChangeRequirements('');
  };

  const submitDetailEdit = () => {
    if (!selectedSource || !formData.enterpriseId || !formData.name || !formData.type || !formData.location) return;

    if (formData.status !== selectedSource.status && (formData.status === 'warning' || formData.status === 'danger')) {
      setPendingStatusChange({ source: selectedSource, newStatus: formData.status });
      setStatusChangeReason('');
      setStatusChangeRequirements('');
      setStatusChangeFromDetail(true);
      return;
    }

    const enterprise = state.enterprises.find((e) => e.id === formData.enterpriseId);
    const updatedSource: any = {
      ...selectedSource,
      enterpriseId: formData.enterpriseId,
      enterpriseName: enterprise?.name || selectedSource.enterpriseName,
      name: formData.name,
      type: formData.type,
      level: formData.level,
      location: formData.location,
      status: formData.status,
      controlMeasures: formData.controlMeasures,
      lng: formData.lng,
      lat: formData.lat,
    };

    if (formData.status !== selectedSource.status) {
      updatedSource.statusHistory = [...(selectedSource.statusHistory || []), {
        fromStatus: selectedSource.status,
        toStatus: formData.status,
        changeTime: getCurrentTime(),
      }];
    }

    dispatch({ type: 'UPDATE_HAZARD_SOURCE', payload: updatedSource });
    setSelectedSource(updatedSource);
    setDetailEditMode(false);
  };

  return (
    <PageContainer
      title="风险源管理"
      description="管理园区内重大危险源信息"
      actions={
        <button onClick={handleCreate} className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          新增危险源
        </button>
      }
    >
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            className="input w-40"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">全部等级</option>
            <option value="one">一级</option>
            <option value="two">二级</option>
            <option value="three">三级</option>
            <option value="four">四级</option>
          </select>
          <select
            className="input w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="normal">正常</option>
            <option value="warning">预警</option>
            <option value="danger">危险</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
            <MapPin size={18} className="mr-2 text-primary-600" />
            风险分布
          </h3>
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-80 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            {state.hazardSources.map((source) => {
              const pos = getMapPosition(source.lng || 116.404, source.lat || 39.915);
              return (
                <div
                  key={source.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => handleViewDetail(source)}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${getHazardLevelColor(source.level)} ${
                      source.status === 'danger' ? 'animate-pulse' : ''
                    } ring-2 ring-white shadow-lg`}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {source.name}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-1" />
              <span>一级</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-1" />
              <span>二级</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-1" />
              <span>三级</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1" />
              <span>四级</span>
            </div>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
            <AlertTriangle size={18} className="mr-2 text-amber-500" />
            危险源列表
          </h3>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    危险源名称
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    所属企业
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    类型
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    等级
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    位置
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    状态
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSources.map((source) => (
                  <tr
                    key={source.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 text-sm text-slate-800 font-medium">
                      {source.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {source.enterpriseName}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{source.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge text-white ${getHazardLevelColor(source.level)}`}
                      >
                        {getHazardLevelText(source.level)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{source.location}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={source.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(source)}
                          className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
                        >
                          <Eye size={14} className="mr-1" />
                          详情
                        </button>
                        <button
                          onClick={() => handleEdit(source)}
                          className="text-slate-600 hover:text-slate-700 flex items-center text-sm"
                        >
                          <Edit size={14} className="mr-1" />
                          编辑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">管控措施概览</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSources.slice(0, 4).map((source) => (
            <div key={source.id} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-800">{source.name}</h4>
                <StatusBadge status={source.status} />
              </div>
              <p className="text-sm text-slate-600">{source.controlMeasures}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }}
        title="新增危险源"
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setCreateModalOpen(false);
                resetForm();
              }}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={submitCreate}
              disabled={!formData.enterpriseId || !formData.name || !formData.type || !formData.location}
              className="btn btn-primary"
            >
              保存
            </button>
          </>
        }
      >
        <HazardSourceForm formData={formData} setFormData={setFormData} enterprises={state.enterprises} />
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedSource(null);
          resetForm();
        }}
        title="编辑危险源"
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setEditModalOpen(false);
                setSelectedSource(null);
                resetForm();
              }}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={submitEdit}
              disabled={!formData.enterpriseId || !formData.name || !formData.type || !formData.location}
              className="btn btn-primary"
            >
              保存
            </button>
          </>
        }
      >
        <HazardSourceForm formData={formData} setFormData={setFormData} enterprises={state.enterprises} />
      </Modal>

      <Modal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedSource(null);
          setDetailEditMode(false);
        }}
        title={detailEditMode ? "编辑危险源" : "危险源详情"}
        size="lg"
        footer={
          detailEditMode ? (
            <>
              <button
                onClick={() => setDetailEditMode(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={submitDetailEdit}
                disabled={!formData.enterpriseId || !formData.name || !formData.type || !formData.location}
                className="btn btn-primary"
              >
                保存
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setDetailEditMode(true)}
                className="btn btn-primary flex items-center"
              >
                <Edit size={16} className="mr-1" />
                编辑
              </button>
            </>
          )
        }
      >
        {selectedSource && (
          detailEditMode ? (
            <HazardSourceForm formData={formData} setFormData={setFormData} enterprises={state.enterprises} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">危险源名称</p>
                  <p className="text-slate-800 font-medium mt-1">{selectedSource.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">所属企业</p>
                  <p className="text-slate-800 font-medium mt-1">{selectedSource.enterpriseName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">类型</p>
                  <p className="text-slate-800 font-medium mt-1">{selectedSource.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">等级</p>
                  <span className={`badge text-white ${getHazardLevelColor(selectedSource.level)} mt-1`}>
                    {getHazardLevelText(selectedSource.level)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">位置</p>
                  <p className="text-slate-800 font-medium mt-1">{selectedSource.location}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">状态</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedSource.status} />
                  </div>
                </div>
                {selectedSource.lng && selectedSource.lat && (
                  <>
                    <div>
                      <p className="text-sm text-slate-500">经度</p>
                      <p className="text-slate-800 font-medium mt-1 font-mono">{selectedSource.lng.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">纬度</p>
                      <p className="text-slate-800 font-medium mt-1 font-mono">{selectedSource.lat.toFixed(6)}</p>
                    </div>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">管控措施</p>
                <p className="text-slate-800 mt-1 bg-slate-50 p-3 rounded-lg">{selectedSource.controlMeasures}</p>
              </div>
              {selectedSource.statusHistory && selectedSource.statusHistory.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">状态变更记录</p>
                  <div className="space-y-3">
                    {[...selectedSource.statusHistory].reverse().map((record: any, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex flex-col items-center mr-3">
                          <div className={`w-3 h-3 rounded-full ${
                            record.toStatus === 'danger' ? 'bg-red-500' :
                            record.toStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          {idx < (selectedSource.statusHistory?.length || 0) - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">
                              {record.fromStatus === 'normal' ? '正常' : record.fromStatus === 'warning' ? '预警' : '危险'}
                              <span className="mx-2 text-slate-400">→</span>
                              {record.toStatus === 'normal' ? '正常' : record.toStatus === 'warning' ? '预警' : '危险'}
                            </span>
                            <span className="text-xs text-slate-500">{record.changeTime}</span>
                          </div>
                          {record.reason && (
                            <p className="text-sm text-slate-600 mt-1">原因：{record.reason}</p>
                          )}
                          {record.requirements && (
                            <p className="text-sm text-slate-600 mt-1">处置要求：{record.requirements}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </Modal>

      <Modal
        open={!!pendingStatusChange}
        onClose={() => setPendingStatusChange(null)}
        title="状态变更确认"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setPendingStatusChange(null)} className="btn btn-secondary">取消</button>
            <button onClick={confirmStatusChange} className="btn btn-primary">确认变更</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 font-medium">
              即将将风险源「{pendingStatusChange?.source.name}」状态从「
              {pendingStatusChange?.source.status === 'normal' ? '正常' : pendingStatusChange?.source.status === 'warning' ? '预警' : '危险'}
              」变更为「
              {pendingStatusChange?.newStatus === 'warning' ? '预警' : '危险'}
              」
            </p>
          </div>
          <div>
            <label className="label">变更原因</label>
            <textarea
              className="input min-h-[80px]"
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
              placeholder="请填写状态变更原因"
            />
          </div>
          <div>
            <label className="label">处置要求</label>
            <textarea
              className="input min-h-[80px]"
              value={statusChangeRequirements}
              onChange={(e) => setStatusChangeRequirements(e.target.value)}
              placeholder="请填写处置要求"
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}

function HazardSourceForm({ formData, setFormData, enterprises }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">所属企业</label>
        <select
          className="input"
          value={formData.enterpriseId}
          onChange={(e) => setFormData({ ...formData, enterpriseId: e.target.value })}
        >
          <option value="">请选择企业</option>
          {enterprises.map((e: any) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">危险源名称</label>
          <input
            type="text"
            className="input"
            placeholder="请输入危险源名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">类型</label>
          <input
            type="text"
            className="input"
            placeholder="请输入类型"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">等级</label>
          <select
            className="input"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          >
            <option value="one">一级</option>
            <option value="two">二级</option>
            <option value="three">三级</option>
            <option value="four">四级</option>
          </select>
        </div>
        <div>
          <label className="label">状态</label>
          <select
            className="input"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="normal">正常</option>
            <option value="warning">预警</option>
            <option value="danger">危险</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">位置</label>
        <input
          type="text"
          className="input"
          placeholder="请输入位置"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div>
        <label className="label">管控措施</label>
        <textarea
          className="input min-h-24"
          placeholder="请输入管控措施"
          value={formData.controlMeasures}
          onChange={(e) => setFormData({ ...formData, controlMeasures: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">经度（可选）</label>
          <input
            type="number"
            step="0.000001"
            className="input"
            placeholder="经度"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="label">纬度（可选）</label>
          <input
            type="number"
            step="0.000001"
            className="input"
            placeholder="纬度"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
