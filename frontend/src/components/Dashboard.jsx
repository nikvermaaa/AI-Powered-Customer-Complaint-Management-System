import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, AlertTriangle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/complaints');
      if (response.data.status === 'success') {
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return <span className="text-slate-400">-</span>;
    const p = priority.toLowerCase();
    if (p === 'urgent' || p === 'critical') {
      return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full flex items-center w-fit gap-1"><AlertTriangle size={12}/> {priority}</span>;
    }
    if (p === 'high') {
      return <span className="px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full flex items-center w-fit gap-1"><AlertCircle size={12}/> {priority}</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full">{priority}</span>;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading database records...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full h-full">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3 bg-slate-50">
        <Database className="text-indigo-600" size={24} />
        <div>
          <h2 className="text-xl font-bold text-slate-900">Stored Complaints Database</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Showing all records saved to Aiven MySQL</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Product</th>
              <th className="p-4">Batch No.</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Date Logged</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">No complaints found in the database.</td>
              </tr>
            ) : (
              complaints.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">#{item.id}</td>
                  <td className="p-4 text-slate-700">{item.customer_name || 'N/A'}</td>
                  <td className="p-4 text-slate-700">{item.product_name || 'N/A'}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{item.batch_number || 'N/A'}</td>
                  <td className="p-4">{getPriorityBadge(item.priority)}</td>
                  <td className="p-4 text-slate-500">{item.complaint_date || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;