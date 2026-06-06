import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { enterprises } from '@/data/mock';
import { getRiskLevelColor, getRiskLevelText } from '@/utils';

export default function Enterprise() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredEnterprises = enterprises.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = riskFilter === 'all' || e.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <PageContainer
      title="企业档案"
      description="管理园区内危化品企业基础信息"
      actions={
        <button className="btn btn-primary flex items-center">
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
                    <button
                      onClick={() => navigate(`/enterprise/${enterprise.id}`)}
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
    </PageContainer>
  );
}
