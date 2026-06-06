export interface Enterprise {
  id: string;
  name: string;
  code: string;
  type: string;
  address: string;
  contact: string;
  phone: string;
  riskLevel: 'high' | 'medium' | 'low';
  score: number;
  createdAt: string;
}

export interface Qualification {
  id: string;
  enterpriseId: string;
  name: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface Tank {
  id: string;
  enterpriseId: string;
  name: string;
  code: string;
  capacity: number;
  medium: string;
  hazardLevel: string;
  status: 'normal' | 'maintenance' | 'abnormal';
}

export interface Warehouse {
  id: string;
  enterpriseId: string;
  name: string;
  area: number;
  category: string;
  items: string;
  status: 'normal' | 'abnormal';
}

export interface Contractor {
  id: string;
  enterpriseId: string;
  name: string;
  qualification: string;
  contact: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface TrainingRecord {
  id: string;
  enterpriseId: string;
  title: string;
  date: string;
  participants: number;
  content: string;
  trainer: string;
}

export interface EmergencyMaterial {
  id: string;
  enterpriseId: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  location: string;
}

export interface HazardSource {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  name: string;
  level: 'one' | 'two' | 'three' | 'four';
  type: string;
  location: string;
  controlMeasures: string;
  status: 'normal' | 'warning' | 'danger';
  lng?: number;
  lat?: number;
}

export type WorkTicketType = 'hot' | 'confined';
export type WorkTicketStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';

export interface WorkTicket {
  id: string;
  ticketNo: string;
  type: WorkTicketType;
  enterpriseId: string;
  enterpriseName: string;
  location: string;
  workContent: string;
  applicant: string;
  applyTime: string;
  planStartTime: string;
  planEndTime: string;
  status: WorkTicketStatus;
  approvalRecords: ApprovalRecord[];
  preCheckItems: PreCheckItem[];
}

export interface ApprovalRecord {
  id: string;
  ticketId: string;
  approver: string;
  role: string;
  opinion: string;
  status: 'approved' | 'rejected';
  time: string;
}

export interface PreCheckItem {
  id: string;
  ticketId: string;
  item: string;
  checked: boolean;
  checkedBy?: string;
  checkedTime?: string;
}

export interface InspectionRoute {
  id: string;
  enterpriseId: string;
  name: string;
  points: InspectionPoint[];
  frequency: string;
  status: 'active' | 'inactive';
}

export interface InspectionPoint {
  id: string;
  routeId: string;
  name: string;
  location: string;
  content: string;
  order: number;
}

export interface InspectionTask {
  id: string;
  routeId: string;
  routeName: string;
  enterpriseId: string;
  enterpriseName: string;
  inspector: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'in_progress' | 'completed';
  records: InspectionRecord[];
  abnormalCount: number;
}

export interface InspectionRecord {
  id: string;
  taskId: string;
  pointId: string;
  pointName: string;
  checkTime: string;
  status: 'normal' | 'abnormal';
  description?: string;
}

export interface Rectification {
  id: string;
  source: string;
  sourceId: string;
  enterpriseId: string;
  enterpriseName: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  feedback?: string;
  feedbackTime?: string;
  verifier?: string;
  verifyTime?: string;
}

export interface Incident {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  causeAnalysis: string;
  measures: string;
  reporter: string;
  status: 'reported' | 'processing' | 'closed';
}

export interface DutyRecord {
  id: string;
  date: string;
  shift: string;
  dutyPerson: string;
  handoverContent: string;
  nextDutyPerson: string;
  handoverTime: string;
}

export interface EnterpriseScore {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  totalScore: number;
  safetyManagement: number;
  riskControl: number;
  operationStandard: number;
  training: number;
  emergency: number;
  rank: number;
  month: string;
}

export interface Warning {
  id: string;
  type: 'weather' | 'expiry' | 'abnormal' | 'ticket';
  title: string;
  description: string;
  level: 'info' | 'warning' | 'danger';
  time: string;
  read: boolean;
}

export interface Activity {
  id: string;
  type: 'ticket' | 'inspection' | 'rectification' | 'incident';
  title: string;
  description: string;
  time: string;
  enterpriseName?: string;
}
