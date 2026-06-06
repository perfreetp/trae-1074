import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Building, FileCheck, Cylinder, Warehouse, Users, GraduationCap, Package } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  enterprises,
  qualifications,
  tanks,
  warehouses,
  contractors,
  trainingRecords,
  emergencyMaterials,
} from '@/data/mock';
import { getRiskLevelColor, getRiskLevelText } from '@/utils';

type TabType = 'info' | 'qualification' | 'tank' | 'warehouse' | 'contractor' | 'training' | 'emergency';

export default function EnterpriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const enterprise = enterprises.find((e) => e.id === id);
  const enterpriseQualifications = qualifications.filter((q) => q.enterpriseId === id);
  const enterpriseTanks = tanks.filter((t) => t.enterpriseId === id);
  const enterpriseWarehouses = warehouses.filter((w) => w.enterpriseId === id);
  const enterpriseContractors = contractors.filter((c) => c.enterpriseId === id);
  const enterpriseTraining = trainingRecords.filter((t) => t.enterpriseId === id);
  const enterpriseEmergency = emergencyMaterials.filter((m) => m.enterpriseId === id);

  if (!enterprise) {
    return (
      <PageContainer title="企业详情">
        <p>企业不存在</p>
      </PageContainer>
    );
  }

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'info', label: '基本信息', icon: Building },
    { key: 'qualification', label: '资质管理', icon: FileCheck },
    { key: 'tank', label: '储罐信息', icon: Cylinder },
    { key: 'warehouse', label: '仓库信息', icon: Warehouse },
    { key: 'contractor', label: '承包商', icon: Users },
    { key: 'training', label: '培训记录', icon: GraduationCap },
    { key: 'emergency', label: '应急物资', icon: Package },
  ];

  return (
    <PageContainer
      title={enterprise.name}
      description={enterprise.code}
      actions={
        <>
          <button onClick={() => navigate('/enterprise')} className="btn btn-secondary flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            返回列表
          </button>
          <button className="btn btn-primary flex items-center">
            <Edit size={16} className="mr-1" />
            编辑
          </button>
        </>
      }
    >
      <div className="card p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-500">企业类型</p>
            <p className="text-slate-800 font-medium mt-1">{enterprise.type}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">风险等级</p>
            <span
              className={`badge border ${getRiskLevelColor(enterprise.riskLevel)} mt-1`}
            >
              {getRiskLevelText(enterprise.riskLevel)}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">安全评分</p>
            <p
              className={`text-xl font-bold mt-1 ${
                enterprise.score >= 90
                  ? 'text-emerald-600'
                  : enterprise.score >= 80
                  ? 'text-blue-600'
                  : 'text-amber-600'
              }`}
            >
              {enterprise.score} 分
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">入驻时间</p>
            <p className="text-slate-800 font-medium mt-1">{enterprise.createdAt}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-slate-200 px-5">
          <div className="flex space-x-1 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">企业地址</p>
                  <p className="text-slate-800 mt-1">{enterprise.address}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">联系人</p>
                  <p className="text-slate-800 mt-1">{enterprise.contact}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">联系电话</p>
                  <p className="text-slate-800 mt-1">{enterprise.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">企业编号</p>
                  <p className="text-slate-800 mt-1 font-mono">{enterprise.code}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qualification' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">资质名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">证书编号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">发证日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">有效期至</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {enterpriseQualifications.map((q) => (
                    <tr key={q.id} className="border-t border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-800">{q.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 font-mono">{q.number}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{q.issueDate}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{q.expiryDate}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tank' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">储罐名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">编号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">容量(m³)</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">介质</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">危险等级</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {enterpriseTanks.map((t) => (
                    <tr key={t.id} className="border-t border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-800">{t.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 font-mono">{t.code}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{t.capacity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{t.medium}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{t.hazardLevel}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'warehouse' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">仓库名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">面积(㎡)</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">类别</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">储存物品</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {enterpriseWarehouses.map((w) => (
                    <tr key={w.id} className="border-t border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-800">{w.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{w.area.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{w.category}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{w.items}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={w.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'contractor' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">承包商名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">资质等级</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">联系人</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">联系电话</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {enterpriseContractors.map((c) => (
                    <tr key={c.id} className="border-t border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-800">{c.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{c.qualification}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{c.contact}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{c.phone}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训主题</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">参与人数</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训讲师</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训内容</th>
                  </tr>
                </thead>
                <tbody>
                  {enterpriseTraining.map((t) => (
                    <tr key={t.id} className="border-t border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-800">{t.title}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{t.date}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{t.participants} 人</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{t.trainer}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">{t.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">物资名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">数量</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">单位</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">有效期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">存放位置</th>
                  </tr>
                </thead>
                <tbody>
                  {enterpriseEmergency.map((m) => (
                    <tr key={m.id} className="border-t border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-800">{m.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{m.quantity}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{m.unit}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{m.expiryDate || '-'}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{m.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
