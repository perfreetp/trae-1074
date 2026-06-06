import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, User, FileCheck, AlertCircle, Edit } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import Modal from '@/components/ui/Modal';
import { useStore } from '@/store';
import { getTicketStatusColor, getTicketStatusText, getTicketTypeText } from '@/utils';
import type { ApprovalRecord, PreCheckItem } from '@/types';

export default function WorkTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch, generateId, getCurrentTime } = useStore();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<'approved' | 'rejected'>('approved');
  const [approvalOpinion, setApprovalOpinion] = useState('');
  const [preCheckMode, setPreCheckMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const ticket = state.workTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <PageContainer title="作业票详情">
        <p>作业票不存在</p>
      </PageContainer>
    );
  }

  const allChecked = ticket.preCheckItems.every((item) => checkedItems.includes(item.id));

  const handleApproval = (type: 'approved' | 'rejected') => {
    setApprovalType(type);
    setApprovalOpinion('');
    setApprovalModalOpen(true);
  };

  const submitApproval = () => {
    const record: ApprovalRecord = {
      id: generateId('ar'),
      ticketId: ticket.id,
      approver: '当前用户',
      role: approvalType === 'approved' ? '车间主任' : '安全员',
      opinion: approvalOpinion || (approvalType === 'approved' ? '同意' : '驳回'),
      status: approvalType,
      time: getCurrentTime(),
    };

    const updatedTicket = {
      ...ticket,
      status: approvalType,
      approvalRecords: [...ticket.approvalRecords, record],
    };

    dispatch({ type: 'UPDATE_WORK_TICKET', payload: updatedTicket });
    setApprovalModalOpen(false);
  };

  const togglePreCheckItem = (itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const startPreCheck = () => {
    setPreCheckMode(true);
    setCheckedItems(ticket.preCheckItems.filter((item) => item.checked).map((item) => item.id));
  };

  const startWork = () => {
    const updatedPreCheckItems: PreCheckItem[] = ticket.preCheckItems.map((item) => ({
      ...item,
      checked: checkedItems.includes(item.id),
      checkedBy: checkedItems.includes(item.id) ? '当前用户' : item.checkedBy,
      checkedTime: checkedItems.includes(item.id) ? getCurrentTime() : item.checkedTime,
    }));

    const updatedTicket = {
      ...ticket,
      status: 'in_progress' as const,
      preCheckItems: updatedPreCheckItems,
    };

    dispatch({ type: 'UPDATE_WORK_TICKET', payload: updatedTicket });
    setPreCheckMode(false);
  };

  const completeWork = () => {
    const updatedTicket = {
      ...ticket,
      status: 'completed' as const,
    };
    dispatch({ type: 'UPDATE_WORK_TICKET', payload: updatedTicket });
  };

  const handleEditSubmit = (formData: any) => {
    const enterprise = state.enterprises.find((e) => e.id === formData.enterpriseId);
    const updatedTicket = {
      ...ticket,
      ...formData,
      enterpriseName: enterprise?.name || ticket.enterpriseName,
      status: 'pending' as const,
    };
    dispatch({ type: 'UPDATE_WORK_TICKET', payload: updatedTicket });
    setEditModalOpen(false);
  };

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
              {ticket.safetyMeasures && (
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">安全措施</p>
                  <div className="text-slate-800 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                    {ticket.safetyMeasures}
                  </div>
                </div>
              )}
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
                {ticket.preCheckItems.map((item) => {
                  const isChecked = preCheckMode
                    ? checkedItems.includes(item.id)
                    : item.checked;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      } ${preCheckMode ? 'cursor-pointer hover:border-emerald-300' : ''}`}
                      onClick={() => preCheckMode && togglePreCheckItem(item.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check size={12} />}
                        </div>
                        <span
                          className={`flex-1 ${
                            isChecked ? 'text-slate-800' : 'text-slate-500'
                          }`}
                        >
                          {item.item}
                        </span>
                        {(item.checkedBy || (preCheckMode && checkedItems.includes(item.id))) && (
                          <span className="text-xs text-slate-500">
                            {item.checkedBy || '当前用户'} / {item.checkedTime || getCurrentTime()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {preCheckMode && (
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setPreCheckMode(false);
                      setCheckedItems([]);
                    }}
                    className="btn btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    onClick={startWork}
                    disabled={!allChecked}
                    className="btn btn-primary"
                  >
                    开始作业
                  </button>
                </div>
              )}
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
                  <button onClick={() => handleApproval('approved')} className="btn btn-success w-full">
                    审批通过
                  </button>
                  <button onClick={() => handleApproval('rejected')} className="btn btn-danger w-full">
                    驳回
                  </button>
                </>
              )}
              {ticket.status === 'approved' && !preCheckMode && (
                <button onClick={startPreCheck} className="btn btn-primary w-full">
                  开始作业前确认
                </button>
              )}
              {ticket.status === 'in_progress' && (
                <button onClick={completeWork} className="btn btn-success w-full">
                  完成作业
                </button>
              )}
              {ticket.status === 'rejected' && (
                <button onClick={() => setEditModalOpen(true)} className="btn btn-primary w-full flex items-center justify-center">
                  <Edit size={16} className="mr-1" />
                  编辑并重新提交
                </button>
              )}
              <button className="btn btn-secondary w-full">打印作业票</button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        title={approvalType === 'approved' ? '审批通过' : '驳回'}
        size="md"
        footer={
          <>
            <button onClick={() => setApprovalModalOpen(false)} className="btn btn-secondary">
              取消
            </button>
            <button onClick={submitApproval} className={`btn ${approvalType === 'approved' ? 'btn-success' : 'btn-danger'}`}>
              确认
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            {approvalType === 'approved' ? '请输入审批意见（可选）：' : '请输入驳回原因：'}
          </p>
          <textarea
            className="input min-h-24"
            placeholder={approvalType === 'approved' ? '同意' : '请说明驳回原因...'}
            value={approvalOpinion}
            onChange={(e) => setApprovalOpinion(e.target.value)}
          />
        </div>
      </Modal>

      <EditTicketModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        ticket={ticket}
        enterprises={state.enterprises}
        onSubmit={handleEditSubmit}
      />
    </PageContainer>
  );
}

function EditTicketModal({ open, onClose, ticket, enterprises, onSubmit }: any) {
  const [formData, setFormData] = useState({
    enterpriseId: ticket.enterpriseId,
    location: ticket.location,
    workContent: ticket.workContent,
    applicant: ticket.applicant,
    planStartTime: ticket.planStartTime,
    planEndTime: ticket.planEndTime,
    safetyMeasures: ticket.safetyMeasures || '',
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="编辑作业票"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary">
            取消
          </button>
          <button
            onClick={() => onSubmit(formData)}
            disabled={!formData.enterpriseId || !formData.location || !formData.workContent || !formData.applicant || !formData.planStartTime || !formData.planEndTime}
            className="btn btn-primary"
          >
            重新提交
          </button>
        </>
      }
    >
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
        <div>
          <label className="label">作业地点</label>
          <input
            type="text"
            className="input"
            placeholder="请输入作业地点"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        <div>
          <label className="label">作业内容</label>
          <input
            type="text"
            className="input"
            placeholder="请输入作业内容"
            value={formData.workContent}
            onChange={(e) => setFormData({ ...formData, workContent: e.target.value })}
          />
        </div>
        <div>
          <label className="label">申请人</label>
          <input
            type="text"
            className="input"
            placeholder="请输入申请人姓名"
            value={formData.applicant}
            onChange={(e) => setFormData({ ...formData, applicant: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">计划开始时间</label>
            <input
              type="datetime-local"
              className="input"
              value={formData.planStartTime}
              onChange={(e) => setFormData({ ...formData, planStartTime: e.target.value })}
            />
          </div>
          <div>
            <label className="label">计划结束时间</label>
            <input
              type="datetime-local"
              className="input"
              value={formData.planEndTime}
              onChange={(e) => setFormData({ ...formData, planEndTime: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">安全措施</label>
          <textarea
            className="input min-h-[100px]"
            placeholder="请输入作业安全措施"
            value={formData.safetyMeasures}
            onChange={(e) => setFormData({ ...formData, safetyMeasures: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}
