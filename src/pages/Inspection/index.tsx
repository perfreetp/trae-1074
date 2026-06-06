import { useState } from 'react';
import { ClipboardList, Route, AlertTriangle, CheckCircle, Plus, Eye, MapPin, Calendar, Edit2, Trash2, Play, Check, X, Upload, ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { useStore } from '@/store';
import type { InspectionRoute, InspectionPoint, InspectionTask, Rectification } from '@/types';

type TabType = 'routes' | 'tasks' | 'rectification';

export default function Inspection() {
  const { state, dispatch, generateId, getCurrentTime } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('routes');
  const [statusFilter, setStatusFilter] = useState('all');

  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<InspectionRoute | null>(null);
  const [routeForm, setRouteForm] = useState<{ name: string; enterpriseId: string; frequency: string; status: 'active' | 'inactive' }>({ name: '', enterpriseId: '', frequency: '', status: 'active' });

  const [pointConfigOpen, setPointConfigOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<InspectionRoute | null>(null);
  const [pointModalOpen, setPointModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<InspectionPoint | null>(null);
  const [pointForm, setPointForm] = useState({ name: '', location: '', content: '', order: 1 });

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ routeId: '', inspector: '' });

  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [executingTask, setExecutingTask] = useState<InspectionTask | null>(null);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [checkResults, setCheckResults] = useState<Record<string, { status: 'normal' | 'abnormal'; description: string; photos?: string[] }>>({});
  const [abnormalModalOpen, setAbnormalModalOpen] = useState(false);
  const [abnormalDescription, setAbnormalDescription] = useState('');
  const [abnormalPhotos, setAbnormalPhotos] = useState<string[]>([]);
  const [handlePhotos, setHandlePhotos] = useState<string[]>([]);

  const [rectificationDetailOpen, setRectificationDetailOpen] = useState(false);
  const [selectedRectification, setSelectedRectification] = useState<Rectification | null>(null);
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const [handleForm, setHandleForm] = useState({ feedback: '' });
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const enterpriseMap = state.enterprises.reduce((acc, e) => {
    acc[e.id] = e.name;
    return acc;
  }, {} as Record<string, string>);

  const filteredTasks = state.inspectionTasks.filter(
    (t) => statusFilter === 'all' || t.status === statusFilter
  );
  const filteredRectifications = state.rectifications.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  const openRouteModal = (route?: InspectionRoute) => {
    if (route) {
      setEditingRoute(route);
      setRouteForm({
        name: route.name,
        enterpriseId: route.enterpriseId,
        frequency: route.frequency,
        status: route.status,
      });
    } else {
      setEditingRoute(null);
      setRouteForm({ name: '', enterpriseId: '', frequency: '', status: 'active' });
    }
    setRouteModalOpen(true);
  };

  const saveRoute = () => {
    if (!routeForm.name || !routeForm.enterpriseId || !routeForm.frequency) return;

    if (editingRoute) {
      dispatch({
        type: 'UPDATE_INSPECTION_ROUTE',
        payload: { ...editingRoute, ...routeForm },
      });
    } else {
      const newRoute: InspectionRoute = {
        id: generateId('r'),
        enterpriseId: routeForm.enterpriseId,
        name: routeForm.name,
        frequency: routeForm.frequency,
        status: routeForm.status,
        points: [],
      };
      dispatch({ type: 'ADD_INSPECTION_ROUTE', payload: newRoute });
    }
    setRouteModalOpen(false);
  };

  const deleteRoute = (id: string) => {
    if (confirm('确定要删除这条巡检路线吗？')) {
      dispatch({ type: 'DELETE_INSPECTION_ROUTE', payload: id });
    }
  };

  const openPointConfig = (route: InspectionRoute) => {
    setSelectedRoute(route);
    setPointConfigOpen(true);
  };

  const openPointModal = (point?: InspectionPoint) => {
    if (point) {
      setEditingPoint(point);
      setPointForm({
        name: point.name,
        location: point.location,
        content: point.content,
        order: point.order,
      });
    } else {
      setEditingPoint(null);
      const maxOrder = selectedRoute?.points.reduce((max, p) => Math.max(max, p.order), 0) || 0;
      setPointForm({ name: '', location: '', content: '', order: maxOrder + 1 });
    }
    setPointModalOpen(true);
  };

  const savePoint = () => {
    if (!selectedRoute || !pointForm.name) return;

    let updatedPoints: InspectionPoint[];
    if (editingPoint) {
      updatedPoints = selectedRoute.points.map((p) =>
        p.id === editingPoint.id ? { ...p, ...pointForm } : p
      );
    } else {
      const newPoint: InspectionPoint = {
        id: generateId('p'),
        routeId: selectedRoute.id,
        ...pointForm,
      };
      updatedPoints = [...selectedRoute.points, newPoint];
    }

    const updatedRoute = { ...selectedRoute, points: updatedPoints.sort((a, b) => a.order - b.order) };
    dispatch({
      type: 'UPDATE_INSPECTION_ROUTE',
      payload: updatedRoute,
    });
    setSelectedRoute(updatedRoute);
    setPointModalOpen(false);
  };

  const deletePoint = (pointId: string) => {
    if (!selectedRoute) return;
    if (confirm('确定要删除这个巡检点吗？')) {
      const updatedPoints = selectedRoute.points.filter((p) => p.id !== pointId);
      const updatedRoute = { ...selectedRoute, points: updatedPoints };
      dispatch({
        type: 'UPDATE_INSPECTION_ROUTE',
        payload: updatedRoute,
      });
      setSelectedRoute(updatedRoute);
    }
  };

  const openTaskModal = () => {
    setTaskForm({ routeId: '', inspector: '' });
    setTaskModalOpen(true);
  };

  const saveTask = () => {
    if (!taskForm.routeId || !taskForm.inspector) return;

    const route = state.inspectionRoutes.find((r) => r.id === taskForm.routeId);
    if (!route) return;

    const newTask: InspectionTask = {
      id: generateId('t'),
      routeId: route.id,
      routeName: route.name,
      enterpriseId: route.enterpriseId,
      enterpriseName: enterpriseMap[route.enterpriseId] || '',
      inspector: taskForm.inspector,
      startTime: getCurrentTime(),
      status: 'pending',
      records: [],
      abnormalCount: 0,
    };
    dispatch({ type: 'ADD_INSPECTION_TASK', payload: newTask });
    setTaskModalOpen(false);
  };

  const startExecute = (task: InspectionTask) => {
    const route = state.inspectionRoutes.find((r) => r.id === task.routeId);
    if (!route || route.points.length === 0) {
      alert('该路线没有配置巡检点');
      return;
    }

    setExecutingTask({ ...task, status: 'in_progress' });
    setCurrentPointIndex(0);
    setCheckResults({});
    dispatch({ type: 'UPDATE_INSPECTION_TASK', payload: { ...task, status: 'in_progress' } });
    setExecuteModalOpen(true);
  };

  const handleCheckResult = (status: 'normal' | 'abnormal') => {
    if (!executingTask) return;
    const route = state.inspectionRoutes.find((r) => r.id === executingTask.routeId);
    if (!route) return;
    const currentPoint = route.points[currentPointIndex];

    if (status === 'abnormal') {
      setAbnormalDescription('');
      setAbnormalModalOpen(true);
    } else {
      const newResults: Record<string, { status: 'normal' | 'abnormal'; description: string; photos?: string[] }> = {
        ...checkResults,
        [currentPoint.id]: { status: 'normal', description: '' },
      };
      setCheckResults(newResults);

      if (currentPointIndex < route.points.length - 1) {
        setCurrentPointIndex((prev) => prev + 1);
      } else {
        finishInspectionWithResults(newResults);
      }
    }
  };

  const handleAbnormalPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((f) => f.name);
      setAbnormalPhotos((prev) => [...prev, ...fileNames]);
    }
  };

  const handleHandlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((f) => f.name);
      setHandlePhotos((prev) => [...prev, ...fileNames]);
    }
  };

  const confirmAbnormal = () => {
    if (!executingTask) return;
    const route = state.inspectionRoutes.find((r) => r.id === executingTask.routeId);
    if (!route) return;
    const currentPoint = route.points[currentPointIndex];

    const newResults: Record<string, { status: 'normal' | 'abnormal'; description: string; photos?: string[] }> = {
      ...checkResults,
      [currentPoint.id]: { status: 'abnormal', description: abnormalDescription, photos: abnormalPhotos },
    };
    setCheckResults(newResults);
    setAbnormalModalOpen(false);
    setAbnormalDescription('');
    setAbnormalPhotos([]);

    if (currentPointIndex < route.points.length - 1) {
      setCurrentPointIndex((prev) => prev + 1);
    } else {
      finishInspectionWithResults(newResults);
    }
  };

  const goToPrevPoint = () => {
    if (currentPointIndex > 0) {
      setCurrentPointIndex((prev) => prev - 1);
    }
  };

  const finishInspectionWithResults = (results: Record<string, { status: 'normal' | 'abnormal'; description: string; photos?: string[] }>) => {
    if (!executingTask) return;
    const route = state.inspectionRoutes.find((r) => r.id === executingTask.routeId);
    if (!route) return;

    const records = route.points.map((point) => {
      const result = results[point.id] || { status: 'normal', description: '', photos: [] };
      return {
        id: generateId('rec'),
        taskId: executingTask.id,
        pointId: point.id,
        pointName: point.name,
        checkTime: getCurrentTime(),
        status: result.status,
        description: result.description,
        photos: (result as any).photos || [],
      };
    });

    const abnormalCount = records.filter((r) => r.status === 'abnormal').length;

    const updatedTask: InspectionTask = {
      ...executingTask,
      status: 'completed',
      endTime: getCurrentTime(),
      records,
      abnormalCount,
    };

    dispatch({ type: 'UPDATE_INSPECTION_TASK', payload: updatedTask });

    records
      .filter((r) => r.status === 'abnormal')
      .forEach((record) => {
        const newRectification: any = {
          id: generateId('rect'),
          source: '巡检异常',
          sourceId: record.id,
          enterpriseId: executingTask.enterpriseId,
          enterpriseName: executingTask.enterpriseName,
          title: `${executingTask.routeName} - ${record.pointName} 巡检异常`,
          description: record.description || '巡检发现异常',
          deadline: getCurrentTime().split(' ')[0] + ' 23:59:59',
          status: 'pending',
          photos: (record as any).photos || [],
          handlePhotos: [],
        };
        dispatch({ type: 'ADD_RECTIFICATION', payload: newRectification });
      });

    setExecuteModalOpen(false);
    setExecutingTask(null);
  };

  const finishInspection = () => {
    finishInspectionWithResults(checkResults);
  };

  const openRectificationDetail = (rect: Rectification) => {
    setSelectedRectification(rect);
    setRectificationDetailOpen(true);
  };

  const openHandleModal = (rect: Rectification) => {
    setSelectedRectification(rect);
    setHandleForm({ feedback: '' });
    setHandlePhotos([]);
    setHandleModalOpen(true);
  };

  const submitHandle = () => {
    if (!selectedRectification || !handleForm.feedback) return;

    const newStatus = selectedRectification.status === 'pending' ? 'in_progress' : 'completed';
    const existingHandlePhotos = (selectedRectification as any).handlePhotos || [];
    dispatch({
      type: 'UPDATE_RECTIFICATION',
      payload: {
        ...selectedRectification,
        status: newStatus,
        feedback: handleForm.feedback,
        feedbackTime: getCurrentTime(),
        handlePhotos: [...existingHandlePhotos, ...handlePhotos],
      } as any,
    });
    setHandleModalOpen(false);
    setHandlePhotos([]);
  };

  const openVerifyModal = (rect: Rectification) => {
    setSelectedRectification(rect);
    setVerifyModalOpen(true);
  };

  const handleVerify = (result: 'pass' | 'reject') => {
    if (!selectedRectification) return;

    dispatch({
      type: 'UPDATE_RECTIFICATION',
      payload: {
        ...selectedRectification,
        status: result === 'pass' ? 'verified' : 'in_progress',
        verifier: '安监人员',
        verifyTime: getCurrentTime(),
      },
    });
    setVerifyModalOpen(false);
  };

  const currentRoute = executingTask ? state.inspectionRoutes.find((r) => r.id === executingTask.routeId) : null;
  const currentPoint = currentRoute?.points[currentPointIndex];
  const totalPoints = currentRoute?.points.length || 0;

  return (
    <PageContainer
      title="巡检整改"
      description="管理巡检路线、任务和整改闭环"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-purple-50 rounded-lg mr-4">
            <Route size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">巡检路线</p>
            <p className="text-xl font-bold text-slate-800">{state.inspectionRoutes.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <ClipboardList size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">巡检任务</p>
            <p className="text-xl font-bold text-slate-800">{state.inspectionTasks.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-amber-50 rounded-lg mr-4">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">待整改</p>
            <p className="text-xl font-bold text-slate-800">
              {state.rectifications.filter((r) => r.status === 'pending' || r.status === 'in_progress').length}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-lg mr-4">
            <CheckCircle size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">已验收</p>
            <p className="text-xl font-bold text-slate-800">
              {state.rectifications.filter((r) => r.status === 'verified').length}
            </p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="border-b border-slate-200 px-5">
          <div className="flex space-x-4">
            <button
              onClick={() => { setActiveTab('routes'); setStatusFilter('all'); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'routes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              巡检路线
            </button>
            <button
              onClick={() => { setActiveTab('tasks'); setStatusFilter('all'); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tasks'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              巡检任务
            </button>
            <button
              onClick={() => { setActiveTab('rectification'); setStatusFilter('all'); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rectification'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              整改管理
            </button>
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'routes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">共 {state.inspectionRoutes.length} 条路线</span>
                <button onClick={() => openRouteModal()} className="btn btn-primary flex items-center">
                  <Plus size={16} className="mr-1" />
                  新增路线
                </button>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">路线名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">所属企业</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">巡检点数</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">频次</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.inspectionRoutes.map((route) => (
                      <tr key={route.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openPointConfig(route)}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            {route.name}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{enterpriseMap[route.enterpriseId]}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{route.points.length} 个</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{route.frequency}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={route.status} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openPointConfig(route)} className="text-primary-600 hover:text-primary-700 p-1">
                              <MapPin size={16} />
                            </button>
                            <button onClick={() => openRouteModal(route)} className="text-slate-600 hover:text-slate-800 p-1">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteRoute(route.id)} className="text-red-600 hover:text-red-700 p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <select
                  className="input w-40"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待执行</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                </select>
                <button onClick={openTaskModal} className="btn btn-primary flex items-center">
                  <Plus size={16} className="mr-1" />
                  新建任务
                </button>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">任务名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">所属企业</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">巡检人员</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">开始时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">巡检点</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">异常数</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-800 font-medium">{task.routeName}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{task.enterpriseName}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{task.inspector}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{task.startTime}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {state.inspectionRoutes.find((r) => r.id === task.routeId)?.points.length || 0} 个
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${task.abnormalCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {task.abnormalCount}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="py-3 px-4">
                          {task.status !== 'completed' ? (
                            <button
                              onClick={() => startExecute(task)}
                              className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm"
                            >
                              <Play size={14} className="mr-1" />
                              执行巡检
                            </button>
                          ) : (
                            <button className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
                              <Eye size={14} className="mr-1" />
                              详情
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rectification' && (
            <div>
              <div className="mb-4">
                <select
                  className="input w-40"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待处理</option>
                  <option value="in_progress">处理中</option>
                  <option value="completed">已完成</option>
                  <option value="verified">已验收</option>
                </select>
              </div>
              <div className="space-y-4">
                {filteredRectifications.map((r) => (
                  <div key={r.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-slate-800">{r.title}</h4>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{r.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {r.enterpriseName}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            截止：{r.deadline}
                          </span>
                          <span>来源：{r.source}</span>
                        </div>
                        {r.feedback && (
                          <div className="mt-3 p-3 bg-slate-50 rounded">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">整改反馈：</span>
                              {r.feedback}
                            </p>
                            {r.feedbackTime && (
                              <p className="text-xs text-slate-400 mt-1">{r.feedbackTime}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => openRectificationDetail(r)}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          查看
                        </button>
                        {(r.status === 'pending' || r.status === 'in_progress') && (
                          <button
                            onClick={() => openHandleModal(r)}
                            className="text-emerald-600 hover:text-emerald-700 text-sm"
                          >
                            处理
                          </button>
                        )}
                        {r.status === 'completed' && (
                          <button
                            onClick={() => openVerifyModal(r)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            验收
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        title={editingRoute ? '编辑巡检路线' : '新增巡检路线'}
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setRouteModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={saveRoute} className="btn btn-primary">保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">路线名称</label>
            <input
              type="text"
              className="input"
              value={routeForm.name}
              onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
              placeholder="请输入路线名称"
            />
          </div>
          <div>
            <label className="label">所属企业</label>
            <select
              className="input"
              value={routeForm.enterpriseId}
              onChange={(e) => setRouteForm({ ...routeForm, enterpriseId: e.target.value })}
            >
              <option value="">请选择企业</option>
              {state.enterprises.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">频次</label>
            <input
              type="text"
              className="input"
              value={routeForm.frequency}
              onChange={(e) => setRouteForm({ ...routeForm, frequency: e.target.value })}
              placeholder="如：每日1次"
            />
          </div>
          <div>
            <label className="label">状态</label>
            <select
              className="input"
              value={routeForm.status}
              onChange={(e) => setRouteForm({ ...routeForm, status: e.target.value as 'active' | 'inactive' })}
            >
              <option value="active">启用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={pointConfigOpen}
        onClose={() => setPointConfigOpen(false)}
        title={`巡检点配置 - ${selectedRoute?.name}`}
        size="lg"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setPointConfigOpen(false)} className="btn btn-secondary">关闭</button>
            <button onClick={() => openPointModal()} className="btn btn-primary flex items-center">
              <Plus size={16} className="mr-1" />
              添加巡检点
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {selectedRoute?.points.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MapPin size={48} className="mx-auto mb-3 opacity-50" />
              <p>暂无巡检点，点击下方按钮添加</p>
            </div>
          ) : (
            selectedRoute?.points.map((point, index) => (
              <div key={point.id} className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium mr-4">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{point.name}</h4>
                  <p className="text-sm text-slate-500">位置：{point.location}</p>
                  <p className="text-sm text-slate-500">检查内容：{point.content}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openPointModal(point)} className="text-slate-600 hover:text-slate-800 p-1">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deletePoint(point.id)} className="text-red-600 hover:text-red-700 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      <Modal
        open={pointModalOpen}
        onClose={() => setPointModalOpen(false)}
        title={editingPoint ? '编辑巡检点' : '添加巡检点'}
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setPointModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={savePoint} className="btn btn-primary">保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">点位名称</label>
            <input
              type="text"
              className="input"
              value={pointForm.name}
              onChange={(e) => setPointForm({ ...pointForm, name: e.target.value })}
              placeholder="请输入点位名称"
            />
          </div>
          <div>
            <label className="label">位置</label>
            <input
              type="text"
              className="input"
              value={pointForm.location}
              onChange={(e) => setPointForm({ ...pointForm, location: e.target.value })}
              placeholder="请输入位置"
            />
          </div>
          <div>
            <label className="label">检查内容</label>
            <textarea
              className="input"
              rows={3}
              value={pointForm.content}
              onChange={(e) => setPointForm({ ...pointForm, content: e.target.value })}
              placeholder="请输入检查内容"
            />
          </div>
          <div>
            <label className="label">排序</label>
            <input
              type="number"
              className="input"
              value={pointForm.order}
              onChange={(e) => setPointForm({ ...pointForm, order: parseInt(e.target.value) || 1 })}
              min={1}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="新建巡检任务"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setTaskModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={saveTask} className="btn btn-primary">创建</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">选择路线</label>
            <select
              className="input"
              value={taskForm.routeId}
              onChange={(e) => setTaskForm({ ...taskForm, routeId: e.target.value })}
            >
              <option value="">请选择巡检路线</option>
              {state.inspectionRoutes.filter((r) => r.status === 'active').map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {enterpriseMap[r.enterpriseId]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">巡检人</label>
            <input
              type="text"
              className="input"
              value={taskForm.inspector}
              onChange={(e) => setTaskForm({ ...taskForm, inspector: e.target.value })}
              placeholder="请输入巡检人姓名"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={executeModalOpen}
        onClose={() => {}}
        title={`执行巡检 - ${executingTask?.routeName}`}
        size="lg"
      >
        {currentPoint && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>巡检进度</span>
                <span>{currentPointIndex + 1} / {totalPoints}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentPointIndex + 1) / totalPoints) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg mr-4">
                  {currentPointIndex + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{currentPoint.name}</h3>
                  <p className="text-sm text-slate-500">
                    <MapPin size={14} className="inline mr-1" />
                    {currentPoint.location}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">检查内容</p>
                <p className="text-slate-700">{currentPoint.content}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleCheckResult('normal')}
                className="flex-1 btn bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100 py-4 text-lg"
              >
                <Check size={20} className="inline mr-2" />
                正常
              </button>
              <button
                onClick={() => handleCheckResult('abnormal')}
                className="flex-1 btn bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 py-4 text-lg"
              >
                <X size={20} className="inline mr-2" />
                异常
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrevPoint}
                disabled={currentPointIndex === 0}
                className="btn btn-secondary flex items-center disabled:opacity-50"
              >
                <ArrowLeft size={16} className="mr-1" />
                上一点
              </button>
              <button
                onClick={finishInspection}
                className="btn btn-primary flex items-center"
              >
                提前完成
                <Check size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={abnormalModalOpen}
        onClose={() => setAbnormalModalOpen(false)}
        title="异常情况说明"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setAbnormalModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={confirmAbnormal} className="btn btn-primary">确认提交</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">异常描述</label>
            <textarea
              className="input"
              rows={4}
              value={abnormalDescription}
              onChange={(e) => setAbnormalDescription(e.target.value)}
              placeholder="请详细描述异常情况..."
            />
          </div>
          <div>
            <label className="label">现场照片</label>
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('abnormal-photo-input')?.click()}
            >
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">点击选择照片</p>
              <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG 格式</p>
              <input
                id="abnormal-photo-input"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleAbnormalPhotoSelect}
              />
            </div>
            {abnormalPhotos.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-slate-600">已选择照片：</p>
                <div className="flex flex-wrap gap-2">
                  {abnormalPhotos.map((name, idx) => (
                    <div key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 flex items-center">
                      <span className="truncate max-w-[150px]">{name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAbnormalPhotos(abnormalPhotos.filter((_, i) => i !== idx));
                        }}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={rectificationDetailOpen}
        onClose={() => setRectificationDetailOpen(false)}
        title="整改详情"
        footer={
          <button onClick={() => setRectificationDetailOpen(false)} className="btn btn-primary">关闭</button>
        }
      >
        {selectedRectification && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">标题</p>
              <p className="font-medium text-slate-800">{selectedRectification.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">所属企业</p>
                <p className="text-slate-700">{selectedRectification.enterpriseName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">状态</p>
                <StatusBadge status={selectedRectification.status} />
              </div>
              <div>
                <p className="text-sm text-slate-500">来源</p>
                <p className="text-slate-700">{selectedRectification.source}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">截止日期</p>
                <p className="text-slate-700">{selectedRectification.deadline}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">问题描述</p>
              <p className="text-slate-700">{selectedRectification.description}</p>
            </div>
            {(selectedRectification as any).photos && (selectedRectification as any).photos.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-2">异常现场照片</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedRectification as any).photos.map((name: string, idx: number) => (
                    <div key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 flex items-center">
                      <span className="truncate max-w-[150px]">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedRectification.feedback && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">整改反馈</p>
                <p className="text-slate-700">{selectedRectification.feedback}</p>
                {selectedRectification.feedbackTime && (
                  <p className="text-xs text-slate-400 mt-2">提交时间：{selectedRectification.feedbackTime}</p>
                )}
                {(selectedRectification as any).handlePhotos && (selectedRectification as any).handlePhotos.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-1">整改照片：</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedRectification as any).handlePhotos.map((name: string, idx: number) => (
                        <div key={idx} className="bg-white px-2 py-1 rounded text-xs text-slate-600 flex items-center border border-slate-200">
                          <span className="truncate max-w-[120px]">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedRectification.verifier && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">验收信息</p>
                <p className="text-slate-700">验收人：{selectedRectification.verifier}</p>
                {selectedRectification.verifyTime && (
                  <p className="text-xs text-slate-400 mt-1">验收时间：{selectedRectification.verifyTime}</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={handleModalOpen}
        onClose={() => setHandleModalOpen(false)}
        title={selectedRectification?.status === 'pending' ? '处理整改' : '提交整改完成'}
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setHandleModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={submitHandle} className="btn btn-primary">提交</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">
              {selectedRectification?.status === 'pending' ? '整改措施' : '整改完成说明'}
            </label>
            <textarea
              className="input"
              rows={4}
              value={handleForm.feedback}
              onChange={(e) => setHandleForm({ ...handleForm, feedback: e.target.value })}
              placeholder={selectedRectification?.status === 'pending' ? '请描述整改措施...' : '请描述整改完成情况...'}
            />
          </div>
          <div>
            <label className="label">整改照片</label>
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('handle-photo-input')?.click()}
            >
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">点击选择照片</p>
              <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG 格式</p>
              <input
                id="handle-photo-input"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleHandlePhotoSelect}
              />
            </div>
            {handlePhotos.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-slate-600">已选择照片：</p>
                <div className="flex flex-wrap gap-2">
                  {handlePhotos.map((name, idx) => (
                    <div key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 flex items-center">
                      <span className="truncate max-w-[150px]">{name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHandlePhotos(handlePhotos.filter((_, i) => i !== idx));
                        }}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="整改验收"
        footer={
          <div className="flex space-x-3">
            <button onClick={() => setVerifyModalOpen(false)} className="btn btn-secondary">取消</button>
            <button onClick={() => handleVerify('reject')} className="btn btn-danger">退回</button>
            <button onClick={() => handleVerify('pass')} className="btn btn-primary">通过</button>
          </div>
        }
      >
        {selectedRectification && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">整改反馈</p>
              <p className="text-slate-700">{selectedRectification.feedback || '暂无反馈'}</p>
            </div>
            <p className="text-center text-slate-600">请确认整改是否符合要求？</p>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
