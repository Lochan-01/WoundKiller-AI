import React from 'react';
import { Camera, TrendingUp, MessageCircle, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const recentPhotos = [
    { id: 1, date: '2024-01-15', healing: 85, status: 'improving' },
    { id: 2, date: '2024-01-12', healing: 78, status: 'stable' },
    { id: 3, date: '2024-01-09', healing: 65, status: 'improving' }
  ];

  const quickActions = [
    { icon: Camera, label: 'Take Photo', path: '/take-photo', color: 'bg-blue-600' },
    { icon: TrendingUp, label: 'View Progress', path: '/progress-trends', color: 'bg-green-600' },
    { icon: MessageCircle, label: 'Ask AI Doctor', path: '/ask-doctor', color: 'bg-purple-600' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Monitor your wound healing progress and get AI-powered insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white p-6 rounded-xl hover:opacity-90 transition-opacity`}
            >
              <Icon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold">{action.label}</h3>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Analysis</h2>
          <div className="space-y-4">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{photo.date}</p>
                    <p className="text-sm text-gray-600">Healing: {photo.healing}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {photo.status === 'improving' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    photo.status === 'improving' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {photo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Good Progress</span>
              </div>
              <p className="text-sm text-green-700">Your wound is healing well. Continue current care routine.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Next Check-up</span>
              </div>
              <p className="text-sm text-blue-700">Recommended photo in 3 days for progress tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;