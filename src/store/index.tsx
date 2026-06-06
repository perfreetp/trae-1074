import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type {
  Enterprise,
  Qualification,
  Tank,
  Warehouse,
  Contractor,
  TrainingRecord,
  EmergencyMaterial,
  HazardSource,
  WorkTicket,
  InspectionTask,
  InspectionRoute,
  Rectification,
  Incident,
  DutyRecord,
  EnterpriseScore,
  Warning,
  Activity,
} from '@/types';
import {
  enterprises as initialEnterprises,
  qualifications as initialQualifications,
  tanks as initialTanks,
  warehouses as initialWarehouses,
  contractors as initialContractors,
  trainingRecords as initialTrainingRecords,
  emergencyMaterials as initialEmergencyMaterials,
  hazardSources as initialHazardSources,
  workTickets as initialWorkTickets,
  inspectionTasks as initialInspectionTasks,
  rectifications as initialRectifications,
  incidents as initialIncidents,
  dutyRecords as initialDutyRecords,
  enterpriseScores as initialEnterpriseScores,
  warnings as initialWarnings,
  activities as initialActivities,
} from '@/data/mock';

const STORAGE_KEY = 'hazardous-chemical-safety-data';

interface AppState {
  enterprises: Enterprise[];
  qualifications: Qualification[];
  tanks: Tank[];
  warehouses: Warehouse[];
  contractors: Contractor[];
  trainingRecords: TrainingRecord[];
  emergencyMaterials: EmergencyMaterial[];
  hazardSources: HazardSource[];
  workTickets: WorkTicket[];
  inspectionRoutes: InspectionRoute[];
  inspectionTasks: InspectionTask[];
  rectifications: Rectification[];
  incidents: Incident[];
  dutyRecords: DutyRecord[];
  enterpriseScores: EnterpriseScore[];
  warnings: Warning[];
  activities: Activity[];
}

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_ENTERPRISE'; payload: Enterprise }
  | { type: 'UPDATE_ENTERPRISE'; payload: Enterprise }
  | { type: 'ADD_QUALIFICATION'; payload: Qualification }
  | { type: 'UPDATE_QUALIFICATION'; payload: Qualification }
  | { type: 'DELETE_QUALIFICATION'; payload: string }
  | { type: 'ADD_TANK'; payload: Tank }
  | { type: 'UPDATE_TANK'; payload: Tank }
  | { type: 'DELETE_TANK'; payload: string }
  | { type: 'ADD_WAREHOUSE'; payload: Warehouse }
  | { type: 'UPDATE_WAREHOUSE'; payload: Warehouse }
  | { type: 'DELETE_WAREHOUSE'; payload: string }
  | { type: 'ADD_CONTRACTOR'; payload: Contractor }
  | { type: 'UPDATE_CONTRACTOR'; payload: Contractor }
  | { type: 'DELETE_CONTRACTOR'; payload: string }
  | { type: 'ADD_TRAINING_RECORD'; payload: TrainingRecord }
  | { type: 'UPDATE_TRAINING_RECORD'; payload: TrainingRecord }
  | { type: 'DELETE_TRAINING_RECORD'; payload: string }
  | { type: 'ADD_EMERGENCY_MATERIAL'; payload: EmergencyMaterial }
  | { type: 'UPDATE_EMERGENCY_MATERIAL'; payload: EmergencyMaterial }
  | { type: 'DELETE_EMERGENCY_MATERIAL'; payload: string }
  | { type: 'ADD_HAZARD_SOURCE'; payload: HazardSource }
  | { type: 'UPDATE_HAZARD_SOURCE'; payload: HazardSource }
  | { type: 'ADD_WORK_TICKET'; payload: WorkTicket }
  | { type: 'UPDATE_WORK_TICKET'; payload: WorkTicket }
  | { type: 'ADD_INSPECTION_ROUTE'; payload: InspectionRoute }
  | { type: 'UPDATE_INSPECTION_ROUTE'; payload: InspectionRoute }
  | { type: 'DELETE_INSPECTION_ROUTE'; payload: string }
  | { type: 'ADD_INSPECTION_TASK'; payload: InspectionTask }
  | { type: 'UPDATE_INSPECTION_TASK'; payload: InspectionTask }
  | { type: 'ADD_RECTIFICATION'; payload: Rectification }
  | { type: 'UPDATE_RECTIFICATION'; payload: Rectification }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_INCIDENT'; payload: Incident }
  | { type: 'ADD_DUTY_RECORD'; payload: DutyRecord }
  | { type: 'ADD_ACTIVITY'; payload: Activity };

const initialRoutes: InspectionRoute[] = [
  {
    id: 'r1',
    enterpriseId: 'e1',
    name: '储罐区日常巡检',
    frequency: '每日2次',
    status: 'active',
    points: [
      { id: 'p1', routeId: 'r1', name: 'T-101储罐', location: '厂区西北侧', content: '检查液位、温度、密封情况', order: 1 },
      { id: 'p2', routeId: 'r1', name: 'T-102储罐', location: '厂区西北侧', content: '检查液位、温度、密封情况', order: 2 },
      { id: 'p3', routeId: 'r1', name: 'T-103储罐', location: '厂区西北侧', content: '检查液位、温度、密封情况', order: 3 },
      { id: 'p4', routeId: 'r1', name: '泵区', location: '储罐区南侧', content: '检查泵运行状态、有无泄漏', order: 4 },
    ],
  },
  {
    id: 'r2',
    enterpriseId: 'e1',
    name: '生产区巡检',
    frequency: '每日1次',
    status: 'active',
    points: [
      { id: 'p5', routeId: 'r2', name: '反应釜A', location: '生产区A栋', content: '检查温度、压力、搅拌运行', order: 1 },
      { id: 'p6', routeId: 'r2', name: '反应釜B', location: '生产区A栋', content: '检查温度、压力、搅拌运行', order: 2 },
    ],
  },
  {
    id: 'r3',
    enterpriseId: 'e3',
    name: '气体储罐巡检',
    frequency: '每2小时1次',
    status: 'active',
    points: [
      { id: 'p7', routeId: 'r3', name: 'T-301储罐', location: '厂区北侧', content: '检查压力、液位、泄漏检测', order: 1 },
    ],
  },
];

const initialState: AppState = {
  enterprises: initialEnterprises,
  qualifications: initialQualifications,
  tanks: initialTanks,
  warehouses: initialWarehouses,
  contractors: initialContractors,
  trainingRecords: initialTrainingRecords,
  emergencyMaterials: initialEmergencyMaterials,
  hazardSources: initialHazardSources,
  workTickets: initialWorkTickets,
  inspectionRoutes: initialRoutes,
  inspectionTasks: initialInspectionTasks,
  rectifications: initialRectifications,
  incidents: initialIncidents,
  dutyRecords: initialDutyRecords,
  enterpriseScores: initialEnterpriseScores,
  warnings: initialWarnings,
  activities: initialActivities,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_ENTERPRISE':
      return { ...state, enterprises: [...state.enterprises, action.payload] };
    case 'UPDATE_ENTERPRISE':
      return {
        ...state,
        enterprises: state.enterprises.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'ADD_QUALIFICATION':
      return { ...state, qualifications: [...state.qualifications, action.payload] };
    case 'UPDATE_QUALIFICATION':
      return {
        ...state,
        qualifications: state.qualifications.map((q) =>
          q.id === action.payload.id ? action.payload : q
        ),
      };
    case 'DELETE_QUALIFICATION':
      return {
        ...state,
        qualifications: state.qualifications.filter((q) => q.id !== action.payload),
      };
    case 'ADD_TANK':
      return { ...state, tanks: [...state.tanks, action.payload] };
    case 'UPDATE_TANK':
      return {
        ...state,
        tanks: state.tanks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TANK':
      return { ...state, tanks: state.tanks.filter((t) => t.id !== action.payload) };
    case 'ADD_WAREHOUSE':
      return { ...state, warehouses: [...state.warehouses, action.payload] };
    case 'UPDATE_WAREHOUSE':
      return {
        ...state,
        warehouses: state.warehouses.map((w) =>
          w.id === action.payload.id ? action.payload : w
        ),
      };
    case 'DELETE_WAREHOUSE':
      return {
        ...state,
        warehouses: state.warehouses.filter((w) => w.id !== action.payload),
      };
    case 'ADD_CONTRACTOR':
      return { ...state, contractors: [...state.contractors, action.payload] };
    case 'UPDATE_CONTRACTOR':
      return {
        ...state,
        contractors: state.contractors.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CONTRACTOR':
      return {
        ...state,
        contractors: state.contractors.filter((c) => c.id !== action.payload),
      };
    case 'ADD_TRAINING_RECORD':
      return { ...state, trainingRecords: [...state.trainingRecords, action.payload] };
    case 'UPDATE_TRAINING_RECORD':
      return {
        ...state,
        trainingRecords: state.trainingRecords.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRAINING_RECORD':
      return {
        ...state,
        trainingRecords: state.trainingRecords.filter((t) => t.id !== action.payload),
      };
    case 'ADD_EMERGENCY_MATERIAL':
      return {
        ...state,
        emergencyMaterials: [...state.emergencyMaterials, action.payload],
      };
    case 'UPDATE_EMERGENCY_MATERIAL':
      return {
        ...state,
        emergencyMaterials: state.emergencyMaterials.map((m) =>
          m.id === action.payload.id ? action.payload : m
        ),
      };
    case 'DELETE_EMERGENCY_MATERIAL':
      return {
        ...state,
        emergencyMaterials: state.emergencyMaterials.filter(
          (m) => m.id !== action.payload
        ),
      };
    case 'ADD_HAZARD_SOURCE':
      return { ...state, hazardSources: [...state.hazardSources, action.payload] };
    case 'UPDATE_HAZARD_SOURCE':
      return {
        ...state,
        hazardSources: state.hazardSources.map((h) =>
          h.id === action.payload.id ? action.payload : h
        ),
      };
    case 'ADD_WORK_TICKET':
      return { ...state, workTickets: [...state.workTickets, action.payload] };
    case 'UPDATE_WORK_TICKET':
      return {
        ...state,
        workTickets: state.workTickets.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'ADD_INSPECTION_ROUTE':
      return { ...state, inspectionRoutes: [...state.inspectionRoutes, action.payload] };
    case 'UPDATE_INSPECTION_ROUTE':
      return {
        ...state,
        inspectionRoutes: state.inspectionRoutes.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'DELETE_INSPECTION_ROUTE':
      return {
        ...state,
        inspectionRoutes: state.inspectionRoutes.filter(
          (r) => r.id !== action.payload
        ),
      };
    case 'ADD_INSPECTION_TASK':
      return { ...state, inspectionTasks: [...state.inspectionTasks, action.payload] };
    case 'UPDATE_INSPECTION_TASK':
      return {
        ...state,
        inspectionTasks: state.inspectionTasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'ADD_RECTIFICATION':
      return { ...state, rectifications: [...state.rectifications, action.payload] };
    case 'UPDATE_RECTIFICATION':
      return {
        ...state,
        rectifications: state.rectifications.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [...state.incidents, action.payload] };
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case 'ADD_DUTY_RECORD':
      return { ...state, dutyRecords: [...state.dutyRecords, action.payload] };
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities].slice(0, 50) };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  generateId: (prefix: string) => string;
  getCurrentTime: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'SET_STATE', payload: { ...initialState, ...parsed, inspectionRoutes: parsed.inspectionRoutes || initialRoutes } });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const generateId = (prefix: string) => {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-');
  };

  return (
    <AppContext.Provider value={{ state, dispatch, generateId, getCurrentTime }}>
      {children}
    </AppContext.Provider>
  );
}

export function useStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useStore must be used within an AppProvider');
  }
  return context;
}
