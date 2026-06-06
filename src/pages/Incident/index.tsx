import { useState } from 'react';
import { AlertCircle, Plus, Eye, User, Calendar, Clock, FileText } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import { incidents, dutyRecords } from '@/data/mock';

type TabType = 'incidents' | 'duty';

export default function Incident() {
  const [activeTab, setActiveTab] = useState<TabType>('incidents');

  return (
    <PageContainer
      title="事故苗头"
      description="事故苗头登记和值班交接管理"
      actions={
        <button className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          登记苗头
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-red-50 rounded-lg mr-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">苗头总数</p>
            <p className="text-xl font-bold text-slate-800">{incidents.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-4">
            <Clock size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">处理中</p>
            <p className="text-xl font-bold text-slate-800">
              {incidents.filter((i) => i.status === 'processing').length}
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
              {incidents.filter((i) => i.status === 'closed').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">今日值班</p>
            <p className="text-xl font-bold text-slate-800">王志强</p>
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
            <div className="space-y-4">
              {incidents.map((incident) => (
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
                        <span>地点：{incident.location}</span>
                        <span>上报人：{incident.reporter}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">事件描述</p>
                          <p className="text-sm text-slate-700">{incident.description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">原因分析</p>
                          <p className="text-sm text-slate-700">{incident.causeAnalysis}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">防范措施</p>
                          <p className="text-sm text-slate-700">{incident.measures}</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                      <Eye size={14} className="mr-1" />
                      详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'duty' && (
            <div className="space-y-4">
              {dutyRecords.map((record) => (
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

              <button className="btn btn-secondary w-full">
                新增值班记录
              </button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
