import { getStatusColor, getStatusText } from '@/utils';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
}
