import React, { useState, useEffect } from 'react';
import { FileText, Upload, AlertTriangle, CheckCircle, DollarSign, BarChart3, Monitor, Download, Save, RefreshCw, User, Settings, History, LogOut, Plus, CreditCard } from 'lucide-react';
import AuthenticationForm from './components/AuthenticationForm';
import DocumentUploader from './components/DocumentUploader';
import ConflictAnalyzer from './components/ConflictAnalyzer';
import BillingDashboard from './components/BillingDashboard';
import ExternalMonitor from './components/ExternalMonitor';
import UsageTracker from './components/UsageTracker';
import ReportGenerator from './components/ReportGenerator';
import { useAuth } from './hooks/useAuth';
import { useBilling } from './hooks/useBilling';
import { useConflictDetection } from './hooks/useConflictDetection';

function App() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { billing, chargeBilling, updateBilling } = useBilling();
  const { analyzeDocuments, conflicts, isAnalyzing, healthScore } = useConflictDetection();
  
  const [activeTab, setActiveTab] = useState('upload');
  const [documents, setDocuments] = useState([]);
  const [showResults, setShowResults] = useState(false);

  if (!isAuthenticated) {
    return <AuthenticationForm onLogin={login} />;
  }

  const handleDocumentUpload = (uploadedDocs) => {
    setDocuments(uploadedDocs);
  };

  const handleAnalyzeDocuments = async () => {
    if (documents.length < 2) {
      alert('Please upload at least 2 documents for comparison');
      return;
    }

    // Check billing before analysis
    if (billing.credits < billing.costPerDocument) {
      alert(`Insufficient credits! You need $${billing.costPerDocument} to analyze documents.`);
      return;
    }

    // Charge for document analysis
    await chargeBilling(billing.costPerDocument, 'document');
    
    // Perform analysis
    const results = await analyzeDocuments(documents);
    setShowResults(true);
  };

  const handleNewAnalysis = () => {
    setDocuments([]);
    setShowResults(false);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Doc Checker
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <UsageTracker billing={billing} />
              
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">Welcome, {user.name}!</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/60 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-white/20">
          {[
            { id: 'upload', label: 'Upload Documents', icon: Upload },
            { id: 'billing', label: 'Billing & Usage', icon: DollarSign },
            { id: 'monitor', label: 'External Monitor', icon: Monitor },
            { id: 'history', label: 'History', icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {activeTab === 'upload' && !showResults && (
          <div className="space-y-8">
            <DocumentUploader 
              onDocumentsUpload={handleDocumentUpload}
              documents={documents}
            />
            
            {documents.length >= 2 && (
              <div className="text-center">
                <button
                  onClick={handleAnalyzeDocuments}
                  disabled={isAnalyzing}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing Documents...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      Analyze Documents (${billing.costPerDocument})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && showResults && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Analysis Results</h2>
              <div className="flex gap-3">
                <ReportGenerator 
                  conflicts={conflicts} 
                  healthScore={healthScore}
                  billing={billing}
                  chargeBilling={chargeBilling}
                />
                <button
                  onClick={handleNewAnalysis}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Analysis
                </button>
              </div>
            </div>
            
            <ConflictAnalyzer 
              conflicts={conflicts}
              healthScore={healthScore}
            />
          </div>
        )}

        {activeTab === 'billing' && (
          <BillingDashboard 
            billing={billing} 
            updateBilling={updateBilling}
          />
        )}

        {activeTab === 'monitor' && (
          <ExternalMonitor 
            onUpdateDetected={(update) => {
              // Simulate conflict detection on external update
              console.log('External update detected:', update);
              // In a real app, this would trigger conflict detection
            }}
          />
        )}

        {activeTab === 'history' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis History</h2>
            <p className="text-gray-600">No previous analyses found. Start by uploading documents!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;