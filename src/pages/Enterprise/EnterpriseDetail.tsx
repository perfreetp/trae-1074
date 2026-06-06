import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Building, FileCheck, Cylinder, Warehouse as WarehouseIcon, Users, GraduationCap, Package, Plus } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { useStore } from '@/store';
import { getRiskLevelColor, getRiskLevelText } from '@/utils';
import type { Enterprise } from '@/types';

type TabType = 'info' | 'qualification' | 'tank' | 'warehouse' | 'contractor' | 'training' | 'emergency';

export default function EnterpriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch, generateId } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Enterprise>>({});

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subModalType, setSubModalType] = useState<TabType | null>(null);
  const [editingSubItem, setEditingSubItem] = useState<any>(null);
  const [subFormData, setSubFormData] = useState<any>({});

  const enterprise = state.enterprises.find((e) => e.id === id);
  const enterpriseQualifications = state.qualifications.filter((q) => q.enterpriseId === id);
  const enterpriseTanks = state.tanks.filter((t) => t.enterpriseId === id);
  const enterpriseWarehouses = state.warehouses.filter((w) => w.enterpriseId === id);
  const enterpriseContractors = state.contractors.filter((c) => c.enterpriseId === id);
  const enterpriseTraining = state.trainingRecords.filter((t) => t.enterpriseId === id);
  const enterpriseEmergency = state.emergencyMaterials.filter((m) => m.enterpriseId === id);

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
    { key: 'warehouse', label: '仓库信息', icon: WarehouseIcon },
    { key: 'contractor', label: '承包商', icon: Users },
    { key: 'training', label: '培训记录', icon: GraduationCap },
    { key: 'emergency', label: '应急物资', icon: Package },
  ];

  const handleOpenEditModal = () => {
    setEditForm(enterprise);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    dispatch({ type: 'UPDATE_ENTERPRISE', payload: { ...enterprise, ...editForm } });
    setEditModalOpen(false);
  };

  const openSubModal = (type: TabType, item?: any) => {
    setSubModalType(type);
    setEditingSubItem(item || null);
    if (item) {
      setSubFormData(item);
    } else {
      const defaults: Record<string, any> = {
        qualification: { name: '', number: '', issueDate: '', expiryDate: '', status: 'valid' },
        tank: { name: '', code: '', capacity: 0, medium: '', hazardLevel: '', status: 'normal' },
        warehouse: { name: '', area: 0, category: '', items: '', status: 'normal' },
        contractor: { name: '', qualification: '', contact: '', phone: '', status: 'active' },
        training: { title: '', date: '', participants: 0, content: '', trainer: '' },
        emergency: { name: '', quantity: 0, unit: '', expiryDate: '', location: '' },
      };
      setSubFormData(defaults[type] || {});
    }
    setSubModalOpen(true);
  };

  const handleSubSubmit = () => {
    if (!subModalType || !id) return;

    if (editingSubItem) {
      const actions: Record<string, string> = {
        qualification: 'UPDATE_QUALIFICATION',
        tank: 'UPDATE_TANK',
        warehouse: 'UPDATE_WAREHOUSE',
        contractor: 'UPDATE_CONTRACTOR',
        training: 'UPDATE_TRAINING_RECORD',
        emergency: 'UPDATE_EMERGENCY_MATERIAL',
      };
      dispatch({ type: actions[subModalType] as any, payload: { ...editingSubItem, ...subFormData } });
    } else {
      const newItem = {
        id: generateId(subModalType.substring(0, 2)),
        enterpriseId: id,
        ...subFormData,
      };
      const actions: Record<string, string> = {
        qualification: 'ADD_QUALIFICATION',
        tank: 'ADD_TANK',
        warehouse: 'ADD_WAREHOUSE',
        contractor: 'ADD_CONTRACTOR',
        training: 'ADD_TRAINING_RECORD',
        emergency: 'ADD_EMERGENCY_MATERIAL',
      };
      dispatch({ type: actions[subModalType] as any, payload: newItem });
    }
    setSubModalOpen(false);
  };

  const handleDeleteSubItem = (type: TabType, itemId: string) => {
    if (!confirm('确定要删除此项吗？')) return;
    const actions: Record<string, string> = {
      qualification: 'DELETE_QUALIFICATION',
      tank: 'DELETE_TANK',
      warehouse: 'DELETE_WAREHOUSE',
      contractor: 'DELETE_CONTRACTOR',
      training: 'DELETE_TRAINING_RECORD',
      emergency: 'DELETE_EMERGENCY_MATERIAL',
    };
    dispatch({ type: actions[type] as any, payload: itemId });
  };

  const subModalTitles: Record<string, string> = {
    qualification: editingSubItem ? '编辑资质' : '新增资质',
    tank: editingSubItem ? '编辑储罐' : '新增储罐',
    warehouse: editingSubItem ? '编辑仓库' : '新增仓库',
    contractor: editingSubItem ? '编辑承包商' : '新增承包商',
    training: editingSubItem ? '编辑培训记录' : '新增培训记录',
    emergency: editingSubItem ? '编辑应急物资' : '新增应急物资',
  };

  const renderSubModalContent = () => {
    switch (subModalType) {
      case 'qualification':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">资质名称</label>
              <input className="input" value={subFormData.name || ''} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">证书编号</label>
              <input className="input" value={subFormData.number || ''} onChange={(e) => setSubFormData({ ...subFormData, number: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">发证日期</label>
              <input type="date" className="input" value={subFormData.issueDate || ''} onChange={(e) => setSubFormData({ ...subFormData, issueDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">有效期至</label>
              <input type="date" className="input" value={subFormData.expiryDate || ''} onChange={(e) => setSubFormData({ ...subFormData, expiryDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
              <select className="input" value={subFormData.status || 'valid'} onChange={(e) => setSubFormData({ ...subFormData, status: e.target.value })}>
                <option value="valid">有效</option>
                <option value="expiring">即将到期</option>
                <option value="expired">已过期</option>
              </select>
            </div>
          </div>
        );
      case 'tank':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">储罐名称</label>
              <input className="input" value={subFormData.name || ''} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">编号</label>
              <input className="input" value={subFormData.code || ''} onChange={(e) => setSubFormData({ ...subFormData, code: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">容量(m³)</label>
              <input type="number" className="input" value={subFormData.capacity || 0} onChange={(e) => setSubFormData({ ...subFormData, capacity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">介质</label>
              <input className="input" value={subFormData.medium || ''} onChange={(e) => setSubFormData({ ...subFormData, medium: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">危险等级</label>
              <input className="input" value={subFormData.hazardLevel || ''} onChange={(e) => setSubFormData({ ...subFormData, hazardLevel: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
              <select className="input" value={subFormData.status || 'normal'} onChange={(e) => setSubFormData({ ...subFormData, status: e.target.value })}>
                <option value="normal">正常</option>
                <option value="maintenance">检修中</option>
                <option value="abnormal">异常</option>
              </select>
            </div>
          </div>
        );
      case 'warehouse':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">仓库名称</label>
              <input className="input" value={subFormData.name || ''} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">面积(㎡)</label>
              <input type="number" className="input" value={subFormData.area || 0} onChange={(e) => setSubFormData({ ...subFormData, area: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">类别</label>
              <input className="input" value={subFormData.category || ''} onChange={(e) => setSubFormData({ ...subFormData, category: e.target.value })} placeholder="如：甲类、乙类" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
              <select className="input" value={subFormData.status || 'normal'} onChange={(e) => setSubFormData({ ...subFormData, status: e.target.value })}>
                <option value="normal">正常</option>
                <option value="abnormal">异常</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">储存物品</label>
              <input className="input" value={subFormData.items || ''} onChange={(e) => setSubFormData({ ...subFormData, items: e.target.value })} />
            </div>
          </div>
        );
      case 'contractor':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">承包商名称</label>
              <input className="input" value={subFormData.name || ''} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">资质等级</label>
              <input className="input" value={subFormData.qualification || ''} onChange={(e) => setSubFormData({ ...subFormData, qualification: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">联系人</label>
              <input className="input" value={subFormData.contact || ''} onChange={(e) => setSubFormData({ ...subFormData, contact: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
              <input className="input" value={subFormData.phone || ''} onChange={(e) => setSubFormData({ ...subFormData, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
              <select className="input" value={subFormData.status || 'active'} onChange={(e) => setSubFormData({ ...subFormData, status: e.target.value })}>
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
              </select>
            </div>
          </div>
        );
      case 'training':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">培训主题</label>
              <input className="input" value={subFormData.title || ''} onChange={(e) => setSubFormData({ ...subFormData, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">培训日期</label>
              <input type="date" className="input" value={subFormData.date || ''} onChange={(e) => setSubFormData({ ...subFormData, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">参与人数</label>
              <input type="number" className="input" value={subFormData.participants || 0} onChange={(e) => setSubFormData({ ...subFormData, participants: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">培训讲师</label>
              <input className="input" value={subFormData.trainer || ''} onChange={(e) => setSubFormData({ ...subFormData, trainer: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">培训内容</label>
              <textarea className="input min-h-[80px]" value={subFormData.content || ''} onChange={(e) => setSubFormData({ ...subFormData, content: e.target.value })} />
            </div>
          </div>
        );
      case 'emergency':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">物资名称</label>
              <input className="input" value={subFormData.name || ''} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">数量</label>
              <input type="number" className="input" value={subFormData.quantity || 0} onChange={(e) => setSubFormData({ ...subFormData, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">单位</label>
              <input className="input" value={subFormData.unit || ''} onChange={(e) => setSubFormData({ ...subFormData, unit: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">有效期</label>
              <input type="date" className="input" value={subFormData.expiryDate || ''} onChange={(e) => setSubFormData({ ...subFormData, expiryDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">存放位置</label>
              <input className="input" value={subFormData.location || ''} onChange={(e) => setSubFormData({ ...subFormData, location: e.target.value })} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
          <button onClick={handleOpenEditModal} className="btn btn-primary flex items-center">
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
            <span className={`badge border ${getRiskLevelColor(enterprise.riskLevel)} mt-1`}>
              {getRiskLevelText(enterprise.riskLevel)}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">安全评分</p>
            <p className={`text-xl font-bold mt-1 ${enterprise.score >= 90 ? 'text-emerald-600' : enterprise.score >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
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
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
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
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => openSubModal('qualification')} className="btn btn-primary flex items-center text-sm">
                  <Plus size={14} className="mr-1" />
                  新增资质
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">资质名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">证书编号</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">发证日期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">有效期至</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enterpriseQualifications.map((q) => (
                      <tr key={q.id} className="border-t border-slate-100">
                        <td className="py-3 px-4 text-sm text-slate-800">{q.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600 font-mono">{q.number}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{q.issueDate}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{q.expiryDate}</td>
                        <td className="py-3 px-4"><StatusBadge status={q.status} /></td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openSubModal('qualification', q)} className="text-primary-600 hover:text-primary-700 text-sm">编辑</button>
                            <button onClick={() => handleDeleteSubItem('qualification', q.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tank' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => openSubModal('tank')} className="btn btn-primary flex items-center text-sm">
                  <Plus size={14} className="mr-1" />
                  新增储罐
                </button>
              </div>
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
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
                        <td className="py-3 px-4"><StatusBadge status={t.status} /></td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openSubModal('tank', t)} className="text-primary-600 hover:text-primary-700 text-sm">编辑</button>
                            <button onClick={() => handleDeleteSubItem('tank', t.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'warehouse' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => openSubModal('warehouse')} className="btn btn-primary flex items-center text-sm">
                  <Plus size={14} className="mr-1" />
                  新增仓库
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">仓库名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">面积(㎡)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">类别</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">储存物品</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enterpriseWarehouses.map((w) => (
                      <tr key={w.id} className="border-t border-slate-100">
                        <td className="py-3 px-4 text-sm text-slate-800">{w.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{w.area.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{w.category}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{w.items}</td>
                        <td className="py-3 px-4"><StatusBadge status={w.status} /></td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openSubModal('warehouse', w)} className="text-primary-600 hover:text-primary-700 text-sm">编辑</button>
                            <button onClick={() => handleDeleteSubItem('warehouse', w.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'contractor' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => openSubModal('contractor')} className="btn btn-primary flex items-center text-sm">
                  <Plus size={14} className="mr-1" />
                  新增承包商
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">承包商名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">资质等级</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">联系人</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">联系电话</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enterpriseContractors.map((c) => (
                      <tr key={c.id} className="border-t border-slate-100">
                        <td className="py-3 px-4 text-sm text-slate-800">{c.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{c.qualification}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{c.contact}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{c.phone}</td>
                        <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openSubModal('contractor', c)} className="text-primary-600 hover:text-primary-700 text-sm">编辑</button>
                            <button onClick={() => handleDeleteSubItem('contractor', c.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => openSubModal('training')} className="btn btn-primary flex items-center text-sm">
                  <Plus size={14} className="mr-1" />
                  新增培训
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训主题</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训日期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">参与人数</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训讲师</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">培训内容</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
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
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openSubModal('training', t)} className="text-primary-600 hover:text-primary-700 text-sm">编辑</button>
                            <button onClick={() => handleDeleteSubItem('training', t.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => openSubModal('emergency')} className="btn btn-primary flex items-center text-sm">
                  <Plus size={14} className="mr-1" />
                  新增物资
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">物资名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">数量</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">单位</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">有效期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">存放位置</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
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
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openSubModal('emergency', m)} className="text-primary-600 hover:text-primary-700 text-sm">编辑</button>
                            <button onClick={() => handleDeleteSubItem('emergency', m.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="编辑企业信息" size="lg"
        footer={
          <>
            <button onClick={() => setEditModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={handleSaveEdit} className="btn btn-primary">保存</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">企业名称</label>
            <input className="input" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">企业编号</label>
            <input className="input" value={editForm.code || ''} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">企业类型</label>
            <input className="input" value={editForm.type || ''} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">风险等级</label>
            <select className="input" value={editForm.riskLevel || 'medium'} onChange={(e) => setEditForm({ ...editForm, riskLevel: e.target.value as any })}>
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">企业地址</label>
            <input className="input" value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">联系人</label>
            <input className="input" value={editForm.contact || ''} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
            <input className="input" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">安全评分</label>
            <input type="number" min="0" max="100" className="input" value={editForm.score || 0} onChange={(e) => setEditForm({ ...editForm, score: Number(e.target.value) })} />
          </div>
        </div>
      </Modal>

      <Modal open={subModalOpen} onClose={() => setSubModalOpen(false)} title={subModalType ? subModalTitles[subModalType] : ''} size="lg"
        footer={
          <>
            <button onClick={() => setSubModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={handleSubSubmit} className="btn btn-primary">{editingSubItem ? '保存修改' : '确认新增'}</button>
          </>
        }>
        {renderSubModalContent()}
      </Modal>
    </PageContainer>
  );
}
