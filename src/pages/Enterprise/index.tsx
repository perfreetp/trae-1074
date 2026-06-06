import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import Modal from '@/components/ui/Modal';
import { useStore } from '@/store';
import { getRiskLevelColor, getRiskLevelText } from '@/utils';
import type { Enterprise } from '@/types';

export default function Enterprise() {
  const navigate = useNavigate();
  const { state, dispatch, generateId, getCurrentTime } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    address: '',
    contact: '',
    phone: '',
    riskLevel: 'medium' as 'high' | 'medium' | 'low',
    score: 80,
  });

  const filteredEnterprises = state.enterprises.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = riskFilter === 'all' || e.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const handleOpenModal = (enterprise?: Enterprise) => {
    if (enterprise) {
      setEditingEnterprise(enterprise);
      setFormData({
        name: enterprise.name,
        code: enterprise.code,
        type: enterprise.type,
        address: enterprise.address,
        contact: enterprise.contact,
        phone: enterprise.phone,
        riskLevel: enterprise.riskLevel,
        score: enterprise.score,
      });
    } else {
      setEditingEnterprise(null);
      setFormData({
        name: '',
        code: '',
        type: '',
        address: '',
        contact: '',
        phone: '',
        riskLevel: 'medium',
        score: 80,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) return;

    if (editingEnterprise) {
      dispatch({
        type: 'UPDATE_ENTERPRISE',
        payload: { ...editingEnterprise, ...formData },
      });
    } else {
      const newEnterprise: Enterprise = {
        id: generateId('e'),
        ...formData,
        createdAt: getCurrentTime().split(' ')[0],
      };
      dispatch({ type: 'ADD_ENTERPRISE', payload: newEnterprise });
    }
    setModalOpen(false);
  };

  return (
    <PageContainer
      title="企业档案"
      description="管理园区内危化品企业基础信息"
      actions={
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center"
        >
          <Plus size={16} className="mr-1" />
          新增企业
        </button>
      }
    >
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索企业名称或编号..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input w-40"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">全部风险等级</option>
            <option value="high">高风险</option>
            <option value="medium">中风险</option>
            <option value="low">低风险</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">企业编号</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">企业名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">类型</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">地址</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">风险等级</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">安全评分</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">联系人</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnterprises.map((enterprise) => (
                <tr
                  key={enterprise.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-slate-600 font-mono">{enterprise.code}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium">
                    {enterprise.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{enterprise.type}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{enterprise.address}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge border ${getRiskLevelColor(enterprise.riskLevel)}`}
                    >
                      {getRiskLevelText(enterprise.riskLevel)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        enterprise.score >= 90
                          ? 'text-emerald-600'
                          : enterprise.score >= 80
                          ? 'text-blue-600'
                          : enterprise.score >= 70
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {enterprise.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    <div>{enterprise.contact}</div>
                    <div className="text-xs text-slate-400">{enterprise.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/enterprise/${enterprise.id}`)}
                        className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
                      >
                        <Eye size={14} className="mr-1" />
                        查看
                      </button>
                      <button
                        onClick={() => handleOpenModal(enterprise)}
                        className="text-amber-600 hover:text-amber-700 text-sm"
                      >
                        编辑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="py-3 px-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            共 {filteredEnterprises.length} 条记录
          </p>
          <div className="flex items-center space-x-2">
            <button className="btn btn-secondary text-sm py-1 px-3">上一页</button>
            <button className="btn btn-primary text-sm py-1 px-3">1</button>
            <button className="btn btn-secondary text-sm py-1 px-3">下一页</button>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEnterprise ? '编辑企业' : '新增企业'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              {editingEnterprise ? '保存修改' : '确认新增'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">企业名称 *</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入企业名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">企业编号 *</label>
            <input
              type="text"
              className="input"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="请输入企业编号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">企业类型</label>
            <input
              type="text"
              className="input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="如：石油化工、精细化工"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">风险等级</label>
            <select
              className="input"
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as 'high' | 'medium' | 'low' })}
            >
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">企业地址</label>
            <input
              type="text"
              className="input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="请输入企业地址"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">联系人</label>
            <input
              type="text"
              className="input"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="请输入联系人姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
            <input
              type="text"
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入联系电话"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">安全评分</label>
            <input
              type="number"
              min="0"
              max="100"
              className="input"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
