import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Camera, TrendingUp, MessageCircle, MapPin, Stethoscope, Shield, CheckCircle } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Camera, label: 'Take Photo', path: '/take-photo' },
    { icon: TrendingUp, label: 'Progress Trends', path: '/progress-trends' },
    { icon: MessageCircle, label: 'Ask Doctor', path: '/ask-doctor' },
    { icon: MapPin, label: 'Find Hospitals', path: '/find-hospitals' },
    { icon: Stethoscope, label: 'Doctor Review', path: '/doctor-review' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-40">
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Patient Care</h3>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Privacy & Security</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Your Data</p>
                <p className="text-xs text-gray-500">Your health data is encrypted and secure</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Patient Portal</p>
                  <p className="text-xs text-gray-600">Secure Health Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;