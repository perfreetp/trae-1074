import { useState } from 'react';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { warnings } from '@/data/mock';

interface HeaderProps {
  onToggle: () => void;
}

export default function Header({ onToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = warnings.filter((w) => !w.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        <div className="ml-4 text-sm text-slate-500">
          欢迎使用危化品企业安全监管系统
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
          >
            <Bell size={20} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fade-in">
              <div className="p-3 border-b border-slate-200 font-medium">
                通知消息
              </div>
              <div className="max-h-80 overflow-auto scrollbar-thin">
                {warnings.slice(0, 5).map((warning) => (
                  <div
                    key={warning.id}
                    className={`p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                      !warning.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="mr-2 text-lg">
                        {warning.type === 'weather' && '🌤️'}
                        {warning.type === 'expiry' && '📅'}
                        {warning.type === 'abnormal' && '⚠️'}
                        {warning.type === 'ticket' && '📋'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {warning.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {warning.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  查看全部
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-600" />
            </div>
            <span className="text-sm text-slate-700">管理员</span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fade-in">
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                  个人信息
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                  修改密码
                </button>
                <div className="border-t border-slate-200 my-1" />
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
