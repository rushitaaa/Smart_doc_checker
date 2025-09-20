import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react';

interface Conflict {
  type: string;
  severity: 'high' | 'medium' | 'low';
  docA_text: string;
  docB_text: string;
  explanation: string;
  suggestion: string;
}

interface ConflictAnalyzerProps {
  conflicts: Conflict[];
  healthScore: number;
}

const ConflictAnalyzer: React.FC<ConflictAnalyzerProps> = ({ conflicts, healthScore }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-amber-500 bg-amber-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const summary = {
    total: conflicts.length,
    high: conflicts.filter(c => c.severity === 'high').length,
    medium: conflicts.filter(c => c.severity === 'medium').length,
    low: conflicts.filter(c => c.severity === 'low').length
  };

  return (
    <div className="space-y-8">
      {/* Health Score */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
          <TrendingUp className="w-7 h-7 text-indigo-600" />
          Policy Health Score
        </h2>
        
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(healthScore / 100) * 502.65} 502.65`}
              className={getHealthScoreColor(healthScore)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}%
              </div>
              <div className="text-gray-600 font-medium">Health Score</div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mt-4">
          {healthScore >= 80 ? 'Excellent! Minor issues detected.' :
           healthScore >= 60 ? 'Good, but some conflicts need attention.' :
           'Critical issues found. Immediate action required.'}
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-gray-800">{summary.total}</div>
          <div className="text-gray-600 font-medium">Total Conflicts</div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-red-500">{summary.high}</div>
          <div className="text-gray-600 font-medium">High Risk</div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-amber-500">{summary.medium}</div>
          <div className="text-gray-600 font-medium">Medium Risk</div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-blue-500">{summary.low}</div>
          <div className="text-gray-600 font-medium">Low Risk</div>
        </div>
      </div>

      {/* Conflicts List */}
      {conflicts.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Detected Conflicts</h2>
          
          <div className="space-y-6">
            {conflicts.map((conflict, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-xl p-6 ${getSeverityColor(conflict.severity)} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getSeverityIcon(conflict.severity)}
                  <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getSeverityBadge(conflict.severity)}`}>
                    {conflict.severity}
                  </span>
                  <span className="text-lg font-semibold text-gray-800 capitalize">
                    {conflict.type} Conflict
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Document A:</h4>
                    <p className="bg-white/80 p-4 rounded-lg border border-gray-200 italic">
                      "{conflict.docA_text}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-2xl font-bold text-red-500">VS</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Document B:</h4>
                    <p className="bg-white/80 p-4 rounded-lg border border-gray-200 italic">
                      "{conflict.docB_text}"
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">AI Analysis:</h4>
                    <p className="text-gray-700 leading-relaxed">{conflict.explanation}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Suggested Resolution:</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium leading-relaxed">
                        {conflict.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictAnalyzer;