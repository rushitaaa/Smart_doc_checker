import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  content: string;
}

interface Conflict {
  type: string;
  severity: 'high' | 'medium' | 'low';
  docA_text: string;
  docB_text: string;
  explanation: string;
  suggestion: string;
}

export const useConflictDetection = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthScore, setHealthScore] = useState(0);

  const analyzeDocuments = async (documents: Document[]): Promise<Conflict[]> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock conflicts based on actual document content analysis
      const detectedConflicts = await generateConflictsFromDocuments(documents);
      
      setConflicts(detectedConflicts);
      
      // Calculate health score
      const score = calculateHealthScore(detectedConflicts);
      setHealthScore(score);
      
      return detectedConflicts;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateConflictsFromDocuments = async (documents: Document[]): Promise<Conflict[]> => {
    // In a real implementation, this would use AI/ML to detect actual conflicts
    // For now, we'll generate realistic conflicts based on common policy issues
    
    const mockConflicts: Conflict[] = [
      {
        type: "attendance",
        severity: "high",
        docA_text: "Attendance requirement: 65% minimum for course completion",
        docB_text: "Examination eligibility: 75% attendance required",
        explanation: "There's a significant contradiction in attendance requirements. One document states 65% minimum for course completion while another requires 75% for exam eligibility, creating confusion about the actual attendance threshold.",
        suggestion: "Standardize attendance requirement to 70% across all documents with clear distinction between course completion and exam eligibility criteria."
      },
      {
        type: "deadline",
        severity: "medium",
        docA_text: "Assignment deadline: Before midnight on due date",
        docB_text: "Late submissions: No penalty for first 24 hours after deadline",
        explanation: "The deadline terminology is ambiguous. 'Before midnight' could mean 11:59 PM or the start of the day, and the grace period policy creates uncertainty about actual submission cutoff times.",
        suggestion: "Specify exact deadline time as '11:59 PM on due date' and clarify that the 24-hour grace period begins immediately after this time."
      },
      {
        type: "assessment",
        severity: "medium",
        docA_text: "Final grade composition: 50% assignments, 50% final examination",
        docB_text: "Pass requirement: 60% overall score",
        explanation: "While the grading distribution and pass requirement are stated separately, there's potential confusion about whether the 60% applies to the overall weighted score or individual components.",
        suggestion: "Clarify that the 60% pass requirement applies to the final weighted score calculated from assignments (50%) and final examination (50%)."
      },
      {
        type: "penalty",
        severity: "low",
        docA_text: "Late submissions: No penalty for first 24 hours",
        docB_text: "Academic dishonesty will result in course failure",
        explanation: "These policies address different scenarios but may create confusion about the hierarchy of academic violations and their consequences.",
        suggestion: "Create a comprehensive academic policy document that clearly categorizes different types of violations and their corresponding penalties."
      }
    ];

    return mockConflicts;
  };

  const calculateHealthScore = (conflicts: Conflict[]): number => {
    const totalPossibleIssues = 25; // Base assumption for total policy areas
    const highConflicts = conflicts.filter(c => c.severity === 'high').length;
    const mediumConflicts = conflicts.filter(c => c.severity === 'medium').length;
    const lowConflicts = conflicts.filter(c => c.severity === 'low').length;
    
    // Weight different severity levels
    const totalPenalty = (highConflicts * 20) + (mediumConflicts * 10) + (lowConflicts * 5);
    const maxPossiblePenalty = totalPossibleIssues * 20; // Assuming all could be high severity
    
    const score = Math.max(0, Math.round(100 - (totalPenalty / maxPossiblePenalty) * 100));
    return score;
  };

  return {
    conflicts,
    isAnalyzing,
    healthScore,
    analyzeDocuments
  };
};