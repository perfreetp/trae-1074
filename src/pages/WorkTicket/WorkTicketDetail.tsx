import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, User, FileCheck, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { workTickets } from '@/data/mock';
import { getTicketStatusColor, getTicketStatusText, getTicketTypeText } from '@/utils';

export default function WorkTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ticket = workTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <PageContainer title="作业票详情">
        <p>作业票不存在</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`作业票详情 - ${ticket.ticketNo}`}
      actions={
        <button onClick={() => navigate('/ticket')} className="btn btn-secondary flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          返回列表
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">基本信息</h3>
              <span className={`badge ${getTicketStatusColor(ticket.status)}`}>
                {getTicketStatusText(ticket.status)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">票号</p>
                <p className="text-slate-800 font-medium mt-1 font-mono">{ticket.ticketNo}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">作业类型</p>
                <span
                  className={`badge mt-1 ${
                    ticket.type === 'hot'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {getTicketTypeText(ticket.type)}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500">申请企业</p>
                <p className="text-slate-800 font-medium mt-1">{ticket.enterpriseName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">作业地点</p>
                <p className="text-slate-800 font-medium mt-1">{ticket.location}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-slate-500">作业内容</p>
                <p className="text-slate-800 mt-1">{ticket.workContent}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">申请人</p>
                <p className="text-slate-800 font-medium mt-1">{ticket.applicant}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">申请时间</p>
                <p className="text-slate-800 font-medium mt-1">{ticket.applyTime}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">计划开始时间</p>
                <p className="text-slate-800 font-medium mt-1">{ticket.planStartTime}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">计划结束时间</p>
                <p className="text-slate-800 font-medium mt-1">{ticket.planEndTime}</p>
              </div>
            </div>
          </div>

          {ticket.approvalRecords.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <User size={18} className="mr-2 text-primary-600" />
                审批记录
              </h3>
              <div className="space-y-4">
                {ticket.approvalRecords.map((record, index) => (
                  <div key={record.id} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          record.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {record.status === 'approved' ? <Check size={16} /> : <X size={16} />}
                      </div>
                      {index < ticket.approvalRecords.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-800">{record.approver}</span>
                          <span className="text-sm text-slate-500 ml-2">({record.role})</span>
                        </div>
                        <span className="text-sm text-slate-500">{record.time}</span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          record.status === 'approved' ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {record.status === 'approved' ? '同意' : '驳回'}
                      </p>
                      <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                        {record.opinion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ticket.preCheckItems.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <FileCheck size={18} className="mr-2 text-emerald-600" />
                作业前确认项
              </h3>
              <div className="space-y-2">
                {ticket.preCheckItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border ${
                      item.checked
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                          item.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {item.checked && <Check size={12} />}
                      </div>
                      <span
                        className={`flex-1 ${
                          item.checked ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {item.item}
                      </span>
                      {item.checkedBy && (
                        <span className="text-xs text-slate-500">
                          {item.checkedBy} / {item.checkedTime}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
              <Clock size={18} className="mr-2 text-amber-500" />
              审批进度
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3" />
                <span className="text-sm text-slate-600">提交申请</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    ticket.approvalRecords.length >= 1
                      ? 'bg-emerald-500'
                      : ticket.status === 'rejected'
                      ? 'bg-red-500'
                      : 'bg-slate-300'
                  }`}
                />
                <span className="text-sm text-slate-600">车间主任审批</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    ticket.approvalRecords.length >= 2
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  }`}
                />
                <span className="text-sm text-slate-600">安全员审核</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    ticket.status === 'in_progress' || ticket.status === 'completed'
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  }`}
                />
                <span className="text-sm text-slate-600">作业前确认</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    ticket.status === 'completed'
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  }`}
                />
                <span className="text-sm text-slate-600">作业完成</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
              <AlertCircle size={18} className="mr-2 text-red-500" />
              操作
            </h3>
            <div className="space-y-3">
              {ticket.status === 'pending' && (
                <>
                  <button className="btn btn-success w-full">审批通过</button>
                  <button className="btn btn-danger w-full">驳回</button>
                </>
              )}
              {ticket.status === 'approved' && (
                <button className="btn btn-primary w-full">开始作业前确认</button>
              )}
              {ticket.status === 'in_progress' && (
                <button className="btn btn-success w-full">完成作业</button>
              )}
              {(ticket.status === 'draft' || ticket.status === 'rejected') && (
                <button className="btn btn-primary w-full">编辑并提交</button>
              )}
              <button className="btn btn-secondary w-full">打印作业票</button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
