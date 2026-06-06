import { Building2, AlertTriangle, FileText, Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import PageContainer from '@/components/ui/PageContainer';
import StatCard from '@/components/ui/StatCard';
import {
  enterprises,
  hazardSources,
  workTickets,
  warnings,
  activities,
  rectifications,
} from '@/data/mock';
import {
  getRiskLevelColor,
  getRiskLevelText,
  getWarningLevelColor,
  getWarningTypeIcon,
} from '@/utils';

export default function Dashboard() {
  const pendingTickets = workTickets.filter((t) => t.status === 'pending').length;
  const pendingRectifications = rectifications.filter(
    (r) => r.status === 'pending' || r.status === 'in_progress'
  ).length;

  const ticketTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['动火作业', '受限空间作业'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '动火作业',
        type: 'bar',
        data: [5, 3, 7, 4, 6, 8, 5],
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: '受限空间作业',
        type: 'bar',
        data: [2, 4, 3, 5, 2, 3, 4],
        itemStyle: { color: '#3b82f6' },
      },
    ],
  };

  const riskDistributionOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '风险等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 18, fontWeight: 'bold' },
        },
        labelLine: { show: false },
        data: [
          { value: 2, name: '高风险', itemStyle: { color: '#ef4444' } },
          { value: 2, name: '中风险', itemStyle: { color: '#f59e0b' } },
          { value: 2, name: '低风险', itemStyle: { color: '#10b981' } },
        ],
      },
    ],
  };

  return (
    <PageContainer title="园区总览" description="实时监控园区安全态势">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="企业总数"
          value={enterprises.length}
          icon={<Building2 size={24} />}
          color="blue"
          trend="较上月 +1"
          trendUp
        />
        <StatCard
          title="重大危险源"
          value={hazardSources.length}
          icon={<AlertTriangle size={24} />}
          color="red"
          trend="2个预警中"
          trendUp={false}
        />
        <StatCard
          title="今日作业票"
          value={workTickets.filter((t) => t.status !== 'draft').length}
          icon={<FileText size={24} />}
          color="amber"
          trend={`${pendingTickets} 张待审批`}
          trendUp={false}
        />
        <StatCard
          title="待整改项"
          value={pendingRectifications}
          icon={<Clock size={24} />}
          color="green"
          trend="较昨日 -1"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">近一周作业票趋势</h3>
          <ReactECharts option={ticketTrendOption} style={{ height: '300px' }} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-4">企业风险分布</h3>
          <ReactECharts option={riskDistributionOption} style={{ height: '300px' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold text-slate-800 mb-4">预警提醒</h3>
          <div className="space-y-3 max-h-80 overflow-auto scrollbar-thin">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className={`p-3 rounded-lg border ${getWarningLevelColor(warning.level)} ${
                  !warning.read ? 'animate-pulse-slow' : ''
                }`}
              >
                <div className="flex items-start">
                  <span className="text-xl mr-2">{getWarningTypeIcon(warning.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{warning.title}</p>
                      {!warning.read && (
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs mt-1 opacity-80 line-clamp-2">{warning.description}</p>
                    <p className="text-xs mt-1 opacity-60">{warning.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">实时动态</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      activity.type === 'ticket'
                        ? 'bg-amber-500'
                        : activity.type === 'inspection'
                        ? 'bg-blue-500'
                        : activity.type === 'rectification'
                        ? 'bg-emerald-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {index < activities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                  {activity.enterpriseName && (
                    <span className="inline-block mt-2 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      {activity.enterpriseName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 mt-6">
        <h3 className="font-semibold text-slate-800 mb-4">企业概览</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">企业名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">类型</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">风险等级</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">安全评分</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">联系人</th>
              </tr>
            </thead>
            <tbody>
              {enterprises.slice(0, 5).map((enterprise) => (
                <tr key={enterprise.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-800">{enterprise.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{enterprise.type}</td>
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
                    {enterprise.contact} / {enterprise.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
