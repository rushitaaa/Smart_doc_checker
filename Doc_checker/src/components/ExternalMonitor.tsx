import React, { useState, useEffect } from 'react';
import { Monitor, Globe, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface PolicyUpdate {
  id: string;
  timestamp: string;
  source: string;
  title: string;
  changes: string[];
  status: 'detected' | 'analyzing' | 'completed';
}

interface ExternalMonitorProps {
  onUpdateDetected: (update: PolicyUpdate) => void;
}

const ExternalMonitor: React.FC<ExternalMonitorProps> = ({ onUpdateDetected }) => {
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [updates, setUpdates] = useState<PolicyUpdate[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Simulate external document monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (monitoringActive) {
      interval = setInterval(() => {
        // Simulate random policy updates
        if (Math.random() < 0.3) { // 30% chance of update
          const mockUpdate: PolicyUpdate = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            source: `college-policies-${Math.floor(Math.random() * 3) + 1}.edu`,
            title: getMockUpdateTitle(),
            changes: getMockChanges(),
            status: 'detected'
          };

          setUpdates(prev => [mockUpdate, ...prev.slice(0, 9)]); // Keep last 10
          onUpdateDetected(mockUpdate);

          // Simulate analysis completion
          setTimeout(() => {
            setUpdates(prev => 
              prev.map(u => 
                u.id === mockUpdate.id 
                  ? { ...u, status: 'completed' as const }
                  : u
              )
            );
          }, 3000);
        }
        setLastCheck(new Date());
      }, 10000); // Check every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [monitoringActive, onUpdateDetected]);

  const getMockUpdateTitle = () => {
    const titles = [
      'Updated Attendance Policy - Fall 2024',
      'New Assignment Submission Guidelines',
      'Revised Examination Requirements',
      'Modified Late Submission Penalties',
      'Updated Academic Calendar Changes'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getMockChanges = () => {
    const changes = [
      ['Attendance requirement changed from 75% to 80%', 'New medical leave policies added'],
      ['Submission deadline extended by 2 hours', 'Grace period reduced to 12 hours'],
      ['Minimum passing grade raised to 65%', 'Extra credit opportunities introduced'],
      ['Late penalty increased to 15% per day', 'Weekend submissions now accepted'],
      ['Final exam weightage increased to 60%', 'Mid-term exam requirement removed']
    ];
    return changes[Math.floor(Math.random() * changes.length)];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'analyzing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected':
        return 'bg-amber-50 border-amber-200';
      case 'analyzing':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Monitor className="w-7 h-7 text-blue-600" />
          External Document Monitor
        </h2>

        {/* Monitor Control */}
        <div className="bg-white/80 p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Monitoring Status</h3>
              <p className="text-gray-600">
                Track external policy documents for changes and automatically detect conflicts
              </p>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                monitoringActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  monitoringActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                {monitoringActive ? 'Active' : 'Inactive'}
              </div>
              
              {lastCheck && (
                <p className="text-sm text-gray-500 mt-2">
                  Last check: {lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setMonitoringActive(!monitoringActive)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              monitoringActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1'
            }`}
          >
            {monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        {/* Monitored Sources */}
        <div className="bg-white/80 p-6 rounded-xl border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            Monitored Sources
          </h3>
          
          <div className="grid gap-4">
            {[
              'college-policies-1.edu/academic-handbook',
              'university-guidelines.org/student-policies',
              'academic-regulations.edu/current-rules'
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="font-mono text-sm text-gray-700">{source}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  monitoringActive ? 'bg-green-400' : 'bg-gray-300'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white/80 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Updates</h3>
          
          {updates.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {monitoringActive 
                  ? 'Monitoring for changes... No updates detected yet.'
                  : 'Start monitoring to track external document changes.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className={`p-6 rounded-xl border-2 ${getStatusColor(update.status)} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(update.status)}
                      <div>
                        <h4 className="font-semibold text-gray-800">{update.title}</h4>
                        <p className="text-sm text-gray-600">
                          Source: {update.source}
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-sm text-gray-500">
                      {new Date(update.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Detected Changes:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {update.changes.map((change, index) => (
                        <li key={index} className="text-gray-700 text-sm">
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {update.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✓ Analysis completed. Potential conflicts detected and flagged for review.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalMonitor;