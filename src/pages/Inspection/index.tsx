import { useState } from 'react';
import { ClipboardList, Route, AlertTriangle, CheckCircle, Plus, Eye, MapPin, Calendar } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import { inspectionTasks, rectifications } from '@/data/mock';

type TabType = 'tasks' | 'rectification';

export default function Inspection() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = inspectionTasks.filter(
    (t) => statusFilter === 'all' || t.status === statusFilter
  );
  const filteredRectifications = rectifications.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  return (
    <PageContainer
      title="巡检整改"
      description="管理巡检任务和整改闭环"
      actions={
        <button className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          新建巡检
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <ClipboardList size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">巡检任务</p>
            <p className="text-xl font-bold text-slate-800">{inspectionTasks.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-4">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">待整改</p>
            <p className="text-xl font-bold text-slate-800">
              {rectifications.filter((r) => r.status === 'pending' || r.status === 'in_progress').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-lg mr-4">
            <CheckCircle size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">已完成</p>
            <p className="text-xl font-bold text-slate-800">
              {rectifications.filter((r) => r.status === 'verified').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-purple-50 rounded-lg mr-4">
            <Route size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">巡检路线</p>
            <p className="text-xl font-bold text-slate-800">3</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="border-b border-slate-200 px-5">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tasks'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              巡检任务
            </button>
            <button
              onClick={() => setActiveTab('rectification')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rectification'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              整改管理
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <select
              className="input w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">全部状态</option>
              {activeTab === 'tasks' ? (
                <>
                  <option value="pending">待执行</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                </>
              ) : (
                <>
                  <option value="pending">待处理</option>
                  <option value="in_progress">处理中</option>
                  <option value="completed">已完成</option>
                  <option value="verified">已验收</option>
                </>
              )}
            </select>
          </div>

          {activeTab === 'tasks' && (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      任务名称
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      所属企业
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      巡检人员
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      开始时间
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      巡检点
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      异常数
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
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium">
                        {task.routeName}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {task.enterpriseName}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {task.inspector}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {task.startTime}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {task.records.length} 个
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-medium ${
                            task.abnormalCount > 0 ? 'text-red-600' : 'text-emerald-600'
                          }`}
                        >
                          {task.abnormalCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
                          <Eye size={14} className="mr-1" />
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'rectification' && (
            <div className="space-y-4">
              {filteredRectifications.map((r) => (
                <div key={r.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-800">{r.title}</h4>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{r.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {r.enterpriseName}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          截止：{r.deadline}
                        </span>
                        <span>来源：{r.source}</span>
                      </div>
                      {r.feedback && (
                        <div className="mt-3 p-3 bg-slate-50 rounded">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">整改反馈：</span>
                            {r.feedback}
                          </p>
                          {r.feedbackTime && (
                            <p className="text-xs text-slate-400 mt-1">{r.feedbackTime}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="text-primary-600 hover:text-primary-700 text-sm">
                        查看
                      </button>
                      {(r.status === 'pending' || r.status === 'in_progress') && (
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm">
                          处理
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
