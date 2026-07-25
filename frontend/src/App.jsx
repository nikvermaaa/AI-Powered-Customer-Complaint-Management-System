import React, { useState } from 'react';
import ComplaintForm from './components/ComplaintForm';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard'; // Import the new dashboard
import { LayoutDashboard, FileText } from 'lucide-react'; // Icons for the toggle

function App() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'dashboard'

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8 font-sans flex flex-col">
      
      {/* Top Navigation Toggle */}
      <div className="w-full flex justify-center mb-6">
        <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-200 inline-flex space-x-1">
          <button 
            onClick={() => setActiveTab('form')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'form' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={16} />
            <span>Log New Complaint</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>View Database</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'form' ? (
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <ComplaintForm />
          </div>
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col">
            <AIAssistant />
          </div>
        </div>
      ) : (
        <div className="w-full h-full max-w-7xl mx-auto">
          <Dashboard />
        </div>
      )}

    </div>
  );
}

export default App;