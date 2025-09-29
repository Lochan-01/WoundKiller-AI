import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { TrendingUp, Calendar, Camera, Download, Filter, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressTrends = () => {
  const [progressData, setProgressData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch progress data from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/progress/")
      .then(res => {
        const data = (res.data || []).map(item => ({
          date: item.created_at?.slice(0, 10),
          healing: item.healing_percent ?? 0,
          size: item.wound_width && item.wound_height
            ? `${item.wound_width} cm x ${item.wound_height} cm`
            : "N/A",
        }));
        setProgressData(data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load healing progress");
      });
  }, []);

  const timeframes = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' }
  ];

  const getProgressColor = (current, previous) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getProgressIcon = (current, previous) => {
    if (current > previous) return '↗';
    if (current < previous) return '↘';
    return '→';
  };

  // --- Export function
  const handleExportReport = useCallback(async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      setError(null);

      if (!progressData.length) {
        throw new Error('No data available to export');
      }

      const jsonString = JSON.stringify({
        exportDate: new Date().toISOString(),
        timeframe: selectedTimeframe,
        data: progressData
      }, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `progress_report_${selectedTimeframe}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  }, [progressData, selectedTimeframe, isExporting]);

  // Memoize reversed data
  const reversedProgressData = useMemo(() => [...progressData].reverse(), [progressData]);

  // Memoize stats
  const currentStats = useMemo(() => {
    if (!progressData.length) return null;
    const latest = progressData[progressData.length - 1];
    const previous = progressData[progressData.length - 2];
    const weeklyChange = previous ? latest.healing - previous.healing : 0;

    const firstSize = progressData[0].size.includes("x")
      ? progressData[0].size.split('x').map(s => parseFloat(s))
      : [1, 1];
    const lastSize = latest.size.includes("x")
      ? latest.size.split('x').map(s => parseFloat(s))
      : [1, 1];
    const sizeReduction = ((firstSize[0] * firstSize[1] - lastSize[0] * lastSize[1]) /
      (firstSize[0] * firstSize[1])) * 100;

    return {
      currentHealing: latest.healing,
      weeklyChange,
      currentSize: latest.size,
      sizeReduction: Math.round(sizeReduction)
    };
  }, [progressData]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Trends</h1>
        <p className="text-gray-600">Track your wound healing progress over time.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls + Export */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeframes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExportReport}
          disabled={isExporting}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      {currentStats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Healing</h3>
            <div className="text-3xl font-bold text-green-600">{currentStats.currentHealing}%</div>
            <p className="text-sm text-gray-600">{currentStats.weeklyChange}% since last record</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wound Size</h3>
            <div className="text-3xl font-bold text-blue-600">{currentStats.currentSize}</div>
            <p className="text-sm text-gray-600">Reduced {currentStats.sizeReduction}%</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Photos Recorded</h3>
            <div className="text-3xl font-bold text-purple-600">{progressData.length}</div>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
      )}

      {/* Healing Graph */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Healing Progress Graph</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="healing" stroke="#4F46E5" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Timeline</h2>
        <div className="space-y-4">
          {reversedProgressData.map((d, idx) => {
            const prev = reversedProgressData[idx + 1];
            const color = prev ? getProgressColor(d.healing, prev.healing) : 'text-gray-600';
            const icon = prev ? getProgressIcon(d.healing, prev.healing) : '';
            return (
              <div key={d.date} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{new Date(d.date).toDateString()}</h3>
                  <p className="text-sm text-gray-600">Wound size: {d.size}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${color}`}>{d.healing}% {icon}</div>
                  <div className="text-xs text-gray-500">Healing</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTrends;
