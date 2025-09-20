import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  size: number;
}

interface DocumentUploaderProps {
  onDocumentsUpload: (documents: Document[]) => void;
  documents: Document[];
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentsUpload, documents }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const newDocuments: Document[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        try {
          const content = await readFileAsText(file);
          newDocuments.push({
            id: Date.now() + i + '',
            name: file.name,
            content: content,
            size: file.size
          });
        } catch (error) {
          console.error('Error reading file:', file.name, error);
        }
      }
    }
    
    if (newDocuments.length > 0) {
      const updatedDocuments = [...documents, ...newDocuments];
      onDocumentsUpload(updatedDocuments);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const removeDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    onDocumentsUpload(updatedDocuments);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Upload className="w-7 h-7 text-indigo-600" />
          Upload Documents
        </h2>
        
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Drop your documents here
              </h3>
              <p className="text-gray-600 mb-4">
                Upload 2-3 text documents (.txt) for comparison analysis
              </p>
              
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".txt"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <label
                htmlFor="fileInput"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <File className="w-4 h-4" />
                Choose Files
              </label>
            </div>
            
            <p className="text-sm text-gray-500">
              Supports: TXT files up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Uploaded Documents ({documents.length})
          </h3>
          
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <File className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {documents.length >= 2 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 font-medium">
                ✓ Ready for analysis! You can upload more documents or proceed to analyze.
              </p>
            </div>
          )}
          
          {documents.length === 1 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 font-medium">
                Upload at least one more document to enable conflict analysis.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;