import React from 'react';
import { BarChart3, FileText, Download, DollarSign } from 'lucide-react';

interface Billing {
  credits: number;
  documentsAnalyzed: number;
  reportsGenerated: number;
  totalSpent: number;
  costPerDocument: number;
  costPerReport: number;
}

interface UsageTrackerProps {
  billing: Billing;
}

const UsageTracker: React.FC<UsageTrackerProps> = ({ billing }) => {
  return (
    <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-gray-700">
          ${billing.credits.toFixed(2)}
        </span>
      </div>
      
      <div className="w-px h-4 bg-gray-300" />
      
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">
          {billing.documentsAnalyzed}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">
          {billing.reportsGenerated}
        </span>
      </div>
    </div>
  );
};

export default UsageTracker;