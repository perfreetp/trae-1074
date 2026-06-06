import { useState } from 'react';
import { MapPin, AlertTriangle, Plus, Eye } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import { hazardSources } from '@/data/mock';
import { getHazardLevelColor, getHazardLevelText } from '@/utils';

export default function RiskSource() {
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSources = hazardSources.filter((h) => {
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

  return (
    <PageContainer
      title="风险源管理"
      description="管理园区内重大危险源信息"
      actions={
        <button className="btn btn-primary flex items-center">
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
            {hazardSources.map((source) => {
              const pos = getMapPosition(source.lng || 116.404, source.lat || 39.915);
              return (
                <div
                  key={source.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
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
    </PageContainer>
  );
}
