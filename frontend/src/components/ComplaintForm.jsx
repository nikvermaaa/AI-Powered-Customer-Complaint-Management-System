import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFieldManual, resetForm } from '../store/formSlice';
import { Calendar, Save, RotateCcw } from 'lucide-react';
import axios from 'axios';

const ComplaintForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFieldManual({ field: name, value }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      dispatch(resetForm());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send Redux state to FastAPI backend
      const response = await axios.post('http://localhost:8000/api/save-complaint', formData);
      
      if (response.data.status === 'success') {
        alert(`Complaint successfully saved! Record ID: ${response.data.record_id}`);
        dispatch(resetForm()); // Clear the UI form after saving
      }
    } catch (error) {
      console.error('Error saving complaint:', error);
      alert('Failed to save complaint to database. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-slate-800">
      
      {/* Header Section */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Log Customer Complaint
          </h1>
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1">
            API & FDF Quality Assurance Module
          </p>
        </div>
      </div>

      {/* SECTION 1: ORIGIN & CUSTOMER DETAILS */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          1. ORIGIN & CUSTOMER DETAILS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Complaint Source
            </label>
            <input
              type="text"
              name="complaint_source"
              value={formData.complaint_source || ''}
              onChange={handleChange}
              placeholder="Awaiting AI extraction..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Customer Name
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name || ''}
              onChange={handleChange}
              placeholder="Awaiting AI extraction..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PRODUCT & BATCH IDENTIFICATION */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          2. PRODUCT & BATCH IDENTIFICATION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name || ''}
              onChange={handleChange}
              placeholder="Awaiting AI extraction..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Product Strength/Grade
            </label>
            <input
              type="text"
              name="product_strength"
              value={formData.product_strength || ''}
              onChange={handleChange}
              placeholder="Awaiting AI extraction..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Batch/Lot Number
            </label>
            <input
              type="text"
              name="batch_number"
              value={formData.batch_number || ''}
              onChange={handleChange}
              placeholder="Awaiting AI extraction..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Manufacturing Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="manufacturing_date"
                value={formData.manufacturing_date || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
              />
              <Calendar size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
              />
              <Calendar size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quantity Affected
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="quantity_affected"
                value={formData.quantity_affected || ''}
                onChange={handleChange}
                placeholder="Awaiting AI extraction..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12"
              />
              <span className="absolute right-3 text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: COMPLAINT DETAILS */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          3. COMPLAINT DETAILS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Complaint Type
            </label>
            <input
              type="text"
              name="complaint_type"
              value={formData.complaint_type || ''}
              onChange={handleChange}
              placeholder="Awaiting AI extraction..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Complaint Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="complaint_date"
                value={formData.complaint_date || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
              />
              <Calendar size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Detailed Complaint Description
          </label>
          <textarea
            name="detailed_description"
            rows={4}
            value={formData.detailed_description || ''}
            onChange={handleChange}
            placeholder="Awaiting AI extraction..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>
      </div>

      {/* SECTION 4: INITIAL ASSESSMENT & PRIORITY */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          4. INITIAL ASSESSMENT & PRIORITY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Initial Severity
            </label>
            <select
              name="initial_severity"
              value={formData.initial_severity || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">Awaiting AI extraction...</option>
              <option value="Minor">Minor</option>
              <option value="Moderate">Moderate</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">Awaiting AI extraction...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset Form</span>
        </button>

        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Save size={16} />
          <span>Save Complaint</span>
        </button>
      </div>

    </form>
  );
};

export default ComplaintForm;