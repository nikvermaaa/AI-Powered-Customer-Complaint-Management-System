import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  complaint_source: '', customer_name: '', product_name: '',
  product_strength: '', batch_number: '', manufacturing_date: '',
  expiry_date: '', quantity_affected: '', complaint_type: '',
  complaint_date: '', detailed_description: '', initial_severity: '', priority: ''
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormFromAI: (state, action) => {
      // Merges the new AI data, keeping existing manual edits safe
      return { ...state, ...action.payload };
    },
    updateFieldManual: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateFormFromAI, updateFieldManual, resetForm } = formSlice.actions;
export default formSlice.reducer;