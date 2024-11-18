import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  timestamp: string;
}

interface HealthState {
  metrics: HealthMetric[];
  loading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  metrics: [],
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<HealthMetric[]>) => {
      state.metrics = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMetrics, setLoading, setError } = healthSlice.actions;
export default healthSlice.reducer;