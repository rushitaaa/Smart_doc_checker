import React, { useState } from 'react';
import { DollarSign, CreditCard, Plus, TrendingUp, FileText, Download, AlertCircle } from 'lucide-react';

interface Billing {
  credits: number;
  documentsAnalyzed: number;
  reportsGenerated: number;
  totalSpent: number;
  costPerDocument: number;
  costPerReport: number;
}

interface BillingDashboardProps {
  billing: Billing;
  updateBilling: (updates: Partial<Billing>) => void;
}

const BillingDashboard: React.FC<BillingDashboardProps> = ({ billing, updateBilling }) => {
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(25);

  const handleAddCredits = () => {
    updateBilling({
      credits: billing.credits + creditAmount
    });
    setShowAddCredits(false);
  };

  const getCreditWarningLevel = () => {
    if (billing.credits < 10) return 'critical';
    if (billing.credits < 25) return 'low';
    return 'good';
  };

  const creditWarning = getCreditWarningLevel();

  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <DollarSign className="w-7 h-7 text-green-600" />
          Billing & Usage Dashboard
        </h2>

        {/* Credit Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl border-2 ${
              creditWarning === 'critical' ? 'bg-red-50 border-red-200' :
              creditWarning === 'low' ? 'bg-amber-50 border-amber-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Credit Balance</h3>
                {creditWarning !== 'good' && (
                  <AlertCircle className={`w-6 h-6 ${
                    creditWarning === 'critical' ? 'text-red-500' : 'text-amber-500'
                  }`} />
                )}
              </div>
              
              <div className={`text-4xl font-bold mb-2 ${
                creditWarning === 'critical' ? 'text-red-600' :
                creditWarning === 'low' ? 'text-amber-600' :
                'text-green-600'
              }`}>
                ${billing.credits.toFixed(2)}
              </div>
              
              <button
                onClick={() => setShowAddCredits(true)}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Credits
              </button>
            </div>

            {creditWarning !== 'good' && (
              <div className={`mt-4 p-4 rounded-lg ${
                creditWarning === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <p className="font-medium">
                  {creditWarning === 'critical' 
                    ? '⚠️ Critical: Very low credits! Add more to continue.'
                    : '📊 Warning: Low credits. Consider adding more soon.'
                  }
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/80 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
                </div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {billing.documentsAnalyzed}
                </div>
                <p className="text-gray-600">Analyzed</p>
                <p className="text-sm text-gray-500 mt-1">
                  ${billing.costPerDocument.toFixed(2)} per document
                </p>
              </div>

              <div className="bg-white/80 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-8 h-8 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {billing.reportsGenerated}
                </div>
                <p className="text-gray-600">Generated</p>
                <p className="text-sm text-gray-500 mt-1">
                  ${billing.costPerReport.toFixed(2)} per report
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="bg-white/80 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Usage Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                ${billing.totalSpent.toFixed(2)}
              </div>
              <p className="text-gray-600">Total Spent</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {billing.documentsAnalyzed + billing.reportsGenerated}
              </div>
              <p className="text-gray-600">Total Operations</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                ${((billing.totalSpent / (billing.documentsAnalyzed + billing.reportsGenerated)) || 0).toFixed(2)}
              </div>
              <p className="text-gray-600">Average Cost</p>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white/80 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" />
                <span className="font-medium">Document Analysis</span>
              </div>
              <span className="font-bold text-indigo-600">
                ${billing.costPerDocument.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-green-600" />
                <span className="font-medium">Report Generation</span>
              </div>
              <span className="font-bold text-green-600">
                ${billing.costPerReport.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Credits Modal */}
      {showAddCredits && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-indigo-600" />
              Add Credits
            </h3>
            
            <div className="space-y-4 mb-6">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCreditAmount(amount)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                    creditAmount === amount
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">${amount} Credits</span>
                    <span className="text-sm text-gray-500">
                      ~{Math.floor(amount / billing.costPerDocument)} analyses
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddCredits(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredits}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Add ${creditAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingDashboard;