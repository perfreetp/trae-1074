import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, PieChart, Award, Download } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { enterpriseScores, enterprises, workTickets, warnings } from '@/data/mock';

type TabType = 'score' | 'statistics' | 'warning';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabType>('score');

  const sortedScores = [...enterpriseScores].sort((a, b) => a.rank - b.rank);

  const scoreTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['平均得分', '最高分', '最低分'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: { type: 'value', min: 60, max: 100 },
    series: [
      {
        name: '平均得分',
        type: 'line',
        data: [78, 80, 82, 85, 86, 88],
        smooth: true,
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: '最高分',
        type: 'line',
        data: [90, 92, 93, 94, 95, 95],
        smooth: true,
        itemStyle: { color: '#10b981' },
      },
      {
        name: '最低分',
        type: 'line',
        data: [65, 68, 70, 72, 75, 78],
        smooth: true,
        itemStyle: { color: '#ef4444' },
      },
    ],
  };

  const ticketTypeOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '作业类型',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        data: [
          { value: 35, name: '动火作业', itemStyle: { color: '#f59e0b' } },
          { value: 20, name: '受限空间作业', itemStyle: { color: '#3b82f6' } },
          { value: 15, name: '高处作业', itemStyle: { color: '#8b5cf6' } },
          { value: 10, name: '吊装作业', itemStyle: { color: '#10b981' } },
        ],
      },
    ],
  };

  const warningTypeOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['气象预警', '资质过期', '设备异常', '作业超期'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: '预警数量',
        type: 'bar',
        data: [12, 8, 15, 5],
        itemStyle: {
          color: function (params: any) {
            const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
            return colors[params.dataIndex];
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <PageContainer
      title="监管报表"
      description="企业安全评分和统计分析报表"
      actions={
        <button className="btn btn-secondary flex items-center">
          <Download size={16} className="mr-1" />
          导出报表
        </button>
      }
    >
      <div className="card">
        <div className="border-b border-slate-200 px-5">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('score')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                activeTab === 'score'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Award size={16} className="mr-2" />
              企业评分
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                activeTab === 'statistics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <BarChart3 size={16} className="mr-2" />
              统计分析
            </button>
            <button
              onClick={() => setActiveTab('warning')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                activeTab === 'warning'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <PieChart size={16} className="mr-2" />
              预警汇总
            </button>
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'score' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">安全评分趋势</h3>
                  <ReactECharts option={scoreTrendOption} style={{ height: '300px' }} />
                </div>
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">作业票类型分布</h3>
                  <ReactECharts option={ticketTypeOption} style={{ height: '300px' }} />
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">企业评分排名</h3>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          排名
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          企业名称
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          安全管理
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          风险管控
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          作业规范
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          培训教育
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          应急管理
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          总分
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedScores.map((score) => (
                        <tr
                          key={score.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                score.rank <= 3
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {score.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-800 font-medium">
                            {score.enterpriseName}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {score.safetyManagement}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {score.riskControl}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {score.operationStandard}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {score.training}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {score.emergency}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-lg font-bold ${
                                score.totalScore >= 90
                                  ? 'text-emerald-600'
                                  : score.totalScore >= 80
                                  ? 'text-blue-600'
                                  : score.totalScore >= 70
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {score.totalScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">预警类型统计</h3>
                <ReactECharts option={warningTypeOption} style={{ height: '300px' }} />
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">关键指标</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">企业总数</span>
                    <span className="text-2xl font-bold text-slate-800">{enterprises.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">作业票总数</span>
                    <span className="text-2xl font-bold text-slate-800">{workTickets.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">预警总数</span>
                    <span className="text-2xl font-bold text-amber-600">{warnings.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">平均安全评分</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {Math.round(
                        enterpriseScores.reduce((sum, s) => sum + s.totalScore, 0) /
                          enterpriseScores.length
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'warning' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {warnings.filter((w) => w.type === 'weather').length}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">气象预警</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">
                    {warnings.filter((w) => w.type === 'expiry').length}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">资质过期</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {warnings.filter((w) => w.type === 'abnormal').length}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">设备异常</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {warnings.filter((w) => w.type === 'ticket').length}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">作业超期</p>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">预警详情列表</h3>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          预警类型
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          标题
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          描述
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          级别
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          时间
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                          状态
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {warnings.map((w) => (
                        <tr
                          key={w.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {w.type === 'weather' && '气象预警'}
                            {w.type === 'expiry' && '资质过期'}
                            {w.type === 'abnormal' && '设备异常'}
                            {w.type === 'ticket' && '作业超期'}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-800 font-medium">
                            {w.title}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">
                            {w.description}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`badge ${
                                w.level === 'danger'
                                  ? 'bg-red-100 text-red-800'
                                  : w.level === 'warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {w.level === 'danger'
                                ? '危险'
                                : w.level === 'warning'
                                ? '预警'
                                : '提示'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{w.time}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`badge ${
                                w.read
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {w.read ? '已读' : '未读'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
