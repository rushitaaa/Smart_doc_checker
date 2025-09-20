import React, { useState } from 'react';
import { Download, Save, FileText, FileSpreadsheet, Code, AlertCircle } from 'lucide-react';

interface Conflict {
  type: string;
  severity: 'high' | 'medium' | 'low';
  docA_text: string;
  docB_text: string;
  explanation: string;
  suggestion: string;
}

interface Billing {
  credits: number;
  costPerReport: number;
  reportsGenerated: number;
}

interface ReportGeneratorProps {
  conflicts: Conflict[];
  healthScore: number;
  billing: Billing;
  chargeBilling: (amount: number, type: string) => Promise<void>;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  conflicts,
  healthScore,
  billing,
  chargeBilling
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const checkAndCharge = async () => {
    if (billing.credits < billing.costPerReport) {
      alert(`Insufficient credits! You need $${billing.costPerReport} to generate reports.`);
      return false;
    }

    await chargeBilling(billing.costPerReport, 'report');
    return true;
  };

  const exportToText = async () => {
    if (!(await checkAndCharge())) return;
    
    const reportContent = generateDetailedReport();
    downloadFile(reportContent, 'text/plain', 'smart-doc-checker-report.txt');
    setShowExportOptions(false);
  };

  const exportToCSV = async () => {
    if (!(await checkAndCharge())) return;
    
    const csvContent = generateCSVReport();
    downloadFile(csvContent, 'text/csv', 'conflicts-data.csv');
    setShowExportOptions(false);
  };

  const exportToJSON = async () => {
    if (!(await checkAndCharge())) return;
    
    const jsonContent = generateJSONReport();
    downloadFile(jsonContent, 'application/json', 'analysis-data.json');
    setShowExportOptions(false);
  };

  const downloadFile = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateDetailedReport = () => {
    const timestamp = new Date();
    const summary = {
      total: conflicts.length,
      high: conflicts.filter(c => c.severity === 'high').length,
      medium: conflicts.filter(c => c.severity === 'medium').length,
      low: conflicts.filter(c => c.severity === 'low').length
    };

    return `
=====================================
    SMART DOC CHECKER ANALYSIS REPORT
=====================================

Generated on: ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}
Report ID: SDC-${timestamp.getTime()}

=====================================
EXECUTIVE SUMMARY
=====================================

Policy Health Score: ${healthScore}%

Risk Assessment:
- Total Conflicts Found: ${summary.total}
- High Risk Issues: ${summary.high}
- Medium Risk Issues: ${summary.medium}  
- Low Risk Issues: ${summary.low}

Overall Status: ${healthScore >= 80 ? 'GOOD - Minor issues detected' : 
                 healthScore >= 60 ? 'MODERATE - Several conflicts require attention' : 
                 'CRITICAL - Multiple high-risk conflicts detected'}

=====================================
DETAILED CONFLICT ANALYSIS
=====================================

${conflicts.map((conflict, index) => `
CONFLICT #${index + 1} - ${conflict.type.toUpperCase()} [${conflict.severity.toUpperCase()} RISK]
${'='.repeat(60)}

Document A Statement:
"${conflict.docA_text}"

Document B Statement:  
"${conflict.docB_text}"

AI Analysis:
${conflict.explanation}

Recommended Resolution:
${conflict.suggestion}

Impact Assessment: ${conflict.severity === 'high' ? 'Immediate action required - may cause legal/operational issues' :
                   conflict.severity === 'medium' ? 'Should be resolved within 30 days to prevent confusion' :
                   'Low priority - resolve when convenient'}

${'='.repeat(60)}
`).join('\n')}

=====================================
RECOMMENDATIONS
=====================================

Immediate Actions (High Priority):
${conflicts.filter(c => c.severity === 'high').map((c, i) => `${i+1}. ${c.suggestion}`).join('\n') || 'None'}

Medium-Term Actions (30 days):
${conflicts.filter(c => c.severity === 'medium').map((c, i) => `${i+1}. ${c.suggestion}`).join('\n') || 'None'}

Future Improvements:
${conflicts.filter(c => c.severity === 'low').map((c, i) => `${i+1}. ${c.suggestion}`).join('\n') || 'None'}

=====================================
BILLING INFORMATION
=====================================

Report Generation Cost: $${billing.costPerReport.toFixed(2)}
Total Reports Generated: ${billing.reportsGenerated + 1}
Credits Remaining: ${(billing.credits - billing.costPerReport).toFixed(2)}

=====================================
    END OF REPORT
=====================================
`;
  };

  const generateCSVReport = () => {
    const header = 'Conflict Type,Severity,Document A,Document B,Explanation,Suggestion';
    const rows = conflicts.map(conflict => 
      `"${conflict.type}","${conflict.severity}","${conflict.docA_text}","${conflict.docB_text}","${conflict.explanation}","${conflict.suggestion}"`
    ).join('\n');
    
    return `${header}\n${rows}`;
  };

  const generateJSONReport = () => {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      healthScore: healthScore,
      summary: {
        total: conflicts.length,
        high: conflicts.filter(c => c.severity === 'high').length,
        medium: conflicts.filter(c => c.severity === 'medium').length,
        low: conflicts.filter(c => c.severity === 'low').length
      },
      conflicts: conflicts,
      billing: {
        costPerReport: billing.costPerReport,
        reportsGenerated: billing.reportsGenerated + 1
      }
    }, null, 2);
  };

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowExportOptions(true)}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 font-medium"
      >
        <Download className="w-4 h-4" />
        Export Report (${billing.costPerReport})
      </button>

      {/* Export Options Modal */}
      {showExportOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Export Report</h3>
            <div className="flex items-center gap-2 mb-6 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Cost: ${billing.costPerReport} per export</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={exportToText}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
              >
                <FileText className="w-6 h-6 text-red-500" />
                <div>
                  <div className="font-medium">Detailed Text Report</div>
                  <div className="text-sm text-gray-500">Comprehensive analysis with recommendations</div>
                </div>
              </button>
              
              <button
                onClick={exportToCSV}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
              >
                <FileSpreadsheet className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-medium">CSV Data Export</div>
                  <div className="text-sm text-gray-500">Spreadsheet-friendly format</div>
                </div>
              </button>
              
              <button
                onClick={exportToJSON}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
              >
                <Code className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="font-medium">JSON Export</div>
                  <div className="text-sm text-gray-500">Developer-friendly format</div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowExportOptions(false)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportGenerator;