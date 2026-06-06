import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Filter, Flame, Box } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { workTickets } from '@/data/mock';
import { getTicketStatusColor, getTicketStatusText, getTicketTypeText } from '@/utils';

export default function WorkTicket() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTickets = workTickets.filter((t) => {
    const matchSearch =
      t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.workContent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <PageContainer
      title="作业票证"
      description="管理动火和受限空间作业票证"
      actions={
        <button className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          新建作业票
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-4">
            <Flame size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">动火作业票</p>
            <p className="text-xl font-bold text-slate-800">
              {workTickets.filter((t) => t.type === 'hot').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <Box size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">受限空间作业</p>
            <p className="text-xl font-bold text-slate-800">
              {workTickets.filter((t) => t.type === 'confined').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-4">
            <Filter size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">待审批</p>
            <p className="text-xl font-bold text-slate-800">
              {workTickets.filter((t) => t.status === 'pending').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-lg mr-4">
            <Eye size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">进行中</p>
            <p className="text-xl font-bold text-slate-800">
              {workTickets.filter((t) => t.status === 'in_progress').length}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索票号、企业或作业内容..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input w-40"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">全部类型</option>
            <option value="hot">动火作业</option>
            <option value="confined">受限空间作业</option>
          </select>
          <select
            className="input w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="draft">草稿</option>
            <option value="pending">待审批</option>
            <option value="approved">已批准</option>
            <option value="rejected">已驳回</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">票号</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">类型</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">申请企业</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">作业地点</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">作业内容</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">申请人</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">计划时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-slate-800 font-mono font-medium">
                    {ticket.ticketNo}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge ${
                        ticket.type === 'hot'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {getTicketTypeText(ticket.type)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{ticket.enterpriseName}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{ticket.location}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">
                    {ticket.workContent}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{ticket.applicant}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    <div>{ticket.planStartTime}</div>
                    <div className="text-xs text-slate-400">至 {ticket.planEndTime}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getTicketStatusColor(ticket.status)}`}>
                      {getTicketStatusText(ticket.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="py-3 px-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">共 {filteredTickets.length} 条记录</p>
          <div className="flex items-center space-x-2">
            <button className="btn btn-secondary text-sm py-1 px-3">上一页</button>
            <button className="btn btn-primary text-sm py-1 px-3">1</button>
            <button className="btn btn-secondary text-sm py-1 px-3">下一页</button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
