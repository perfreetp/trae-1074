export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}

export function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getRiskLevelText(level: string): string {
  const texts: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return texts[level] || '未知';
}

export function getHazardLevelColor(level: string): string {
  const colors: Record<string, string> = {
    one: 'bg-red-500',
    two: 'bg-orange-500',
    three: 'bg-amber-500',
    four: 'bg-yellow-500',
  };
  return colors[level] || 'bg-gray-500';
}

export function getHazardLevelText(level: string): string {
  const texts: Record<string, string> = {
    one: '一级',
    two: '二级',
    three: '三级',
    four: '四级',
  };
  return texts[level] || '未知';
}

export function getTicketStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    in_progress: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-slate-100 text-slate-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getTicketStatusText(status: string): string {
  const texts: Record<string, string> = {
    draft: '草稿',
    pending: '待审批',
    approved: '已批准',
    rejected: '已驳回',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  };
  return texts[status] || '未知';
}

export function getTicketTypeText(type: string): string {
  return type === 'hot' ? '动火作业' : '受限空间作业';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    normal: 'bg-green-100 text-green-800',
    maintenance: 'bg-blue-100 text-blue-800',
    abnormal: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    valid: 'bg-green-100 text-green-800',
    expiring: 'bg-amber-100 text-amber-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-amber-100 text-amber-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    verified: 'bg-emerald-100 text-emerald-800',
    reported: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    closed: 'bg-slate-100 text-slate-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    normal: '正常',
    maintenance: '维保中',
    abnormal: '异常',
    active: '有效',
    inactive: '停用',
    warning: '预警',
    danger: '危险',
    valid: '有效',
    expiring: '即将到期',
    expired: '已过期',
    pending: '待处理',
    in_progress: '处理中',
    completed: '已完成',
    verified: '已验收',
    reported: '已上报',
    processing: '处理中',
    closed: '已关闭',
  };
  return texts[status] || status;
}

export function getWarningLevelColor(level: string): string {
  const colors: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };
  return colors[level] || 'bg-gray-50 border-gray-200 text-gray-800';
}

export function getWarningTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    weather: '🌤️',
    expiry: '📅',
    abnormal: '⚠️',
    ticket: '📋',
  };
  return icons[type] || '📢';
}
