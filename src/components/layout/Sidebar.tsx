import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  FileText,
  ClipboardList,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const menuItems = [
  { path: '/', label: '园区总览', icon: LayoutDashboard },
  { path: '/enterprise', label: '企业档案', icon: Building2 },
  { path: '/risk', label: '风险源管理', icon: AlertTriangle },
  { path: '/ticket', label: '作业票证', icon: FileText },
  { path: '/inspection', label: '巡检整改', icon: ClipboardList },
  { path: '/incident', label: '事故苗头', icon: AlertCircle },
  { path: '/reports', label: '监管报表', icon: BarChart3 },
];

export default function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`bg-primary-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-primary-800">
        <h1 className={`font-bold transition-all ${collapsed ? 'text-lg' : 'text-xl'}`}>
          {collapsed ? '安监' : '危化品安全监管'}
        </h1>
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-primary-100 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-primary-800">
        {!collapsed && (
          <div className="text-xs text-primary-300">
            <p>当前角色：园区安监</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}
