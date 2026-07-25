import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormFromAI } from '../store/formSlice';
import axios from 'axios';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Info, 
  Bot, 
  Send 
} from 'lucide-react';

const AIAssistant = () => {
  const dispatch = useDispatch();
  const currentFormData = useSelector((state) => state.form);

  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Input State
  const [chatInput, setChatInput] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText, setPasteText] = useState('');
  
  const fileInputRef = useRef(null);

  // Simulate progress bar movement during the API call
  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
      }, 600);
    } else {
      if (progress > 0) {
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      }
    }
    return () => clearInterval(interval);
  }, [isLoading, progress]);

  // --- Drag & Drop Handlers ---
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessing(null, e.dataTransfer.files[0]);
    }
  };

  // --- Core API Logic ---
  const handleProcessing = async (textToProcess, fileToProcess) => {
    setIsLoading(true);
    const formData = new FormData();
    
    if (fileToProcess) formData.append('file', fileToProcess);
    if (textToProcess) formData.append('text', textToProcess);
    
    // Send current state so the AI doesn't overwrite existing correct data
    formData.append('current_state', JSON.stringify(currentFormData));

    try {
      const response = await axios.post('http://localhost:8000/api/process-complaint', formData);
      
      // Clean null values from the AI response before dispatching to Redux
      const cleanData = Object.fromEntries(
        Object.entries(response.data.updated_form).filter(([_, v]) => v != null && v !== "")
      );
      
      dispatch(updateFormFromAI(cleanData));
    } catch (error) {
      console.error("AI Processing Error:", error);
      alert(error.response?.data?.detail || "An error occurred while communicating with the AI Agent.");
    } finally {
      setIsLoading(false);
      setChatInput('');
      setPasteText('');
      setShowPasteBox(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Sparkles size={20} className="text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
            AI Complaint Intake Assistant
          </h2>
        </div>
      </div>

      {/* File Dropzone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-slate-50/50'
        }`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-3" />
        <p className="text-sm text-slate-700 font-medium">
          Drag & drop complaint document here
        </p>
        <p className="text-sm text-indigo-600 font-medium mt-1">or click to browse</p>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={(e) => {
            if (e.target.files.length > 0) handleProcessing(null, e.target.files[0]);
          }}
          accept=".pdf,.docx,.doc,.txt,.eml"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center space-x-4">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-xs font-medium text-slate-400">OR</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      {/* Text Paste Section */}
      {!showPasteBox ? (
        <button 
          onClick={() => setShowPasteBox(true)}
          className="w-full flex items-center justify-center space-x-2 border border-slate-200 rounded-lg py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <FileText size={16} className="text-slate-500" />
          <span>Paste Complaint Text / Email</span>
        </button>
      ) : (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste raw complaint text or email contents here..."
            className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          />
          <div className="flex space-x-2">
            <button 
              onClick={() => handleProcessing(pasteText, null)}
              disabled={!pasteText.trim()}
              className="flex-1 bg-indigo-600 disabled:bg-indigo-400 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Extract Data
            </button>
            <button 
              onClick={() => setShowPasteBox(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Supported Formats Info */}
      <div className="flex items-start space-x-3 bg-green-50/50 border border-green-100 p-4 rounded-lg">
        <Info size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-green-700 font-medium space-y-1">
          <p>Supported formats: PDF, DOCX, TXT, EML</p>
          <p className="text-green-600/80">Max file size: 10MB</p>
        </div>
      </div>

      {/* Extraction Progress Bar (Only visible when loading) */}
      {isLoading && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Extraction Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            <p>Analyzing document content and extracting key details...</p>
            <p>Please wait, this may take a few moments.</p>
          </div>
        </div>
      )}

      {/* Chat / Assistant UI pinned to bottom */}
      <div className="mt-auto pt-6 space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Assistant</h3>
        
        <div className="flex items-start space-x-3 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
          <div className="bg-white p-1.5 rounded-md shadow-sm">
            <Bot size={18} className="text-indigo-600" />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Upload a complaint document or paste text above.<br/>
            I will automatically extract the details and populate the form for you.
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (chatInput.trim()) handleProcessing(chatInput, null);
          }} 
          className="relative"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask me anything about this complaint..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={isLoading || !chatInput.trim()}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-2">
          AI responses may contain errors. Please verify information.
        </p>
      </div>

    </div>
  );
};

export default AIAssistant;