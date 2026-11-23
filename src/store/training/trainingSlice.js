import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  lastFetchedAt: null,
  cacheTTLms: 5 * 60 * 1000,
};

const isCacheValid = (lastFetchedAt, cacheTTLms) => {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt < cacheTTLms;
};

// --- Async Thunks ---
export const fetchTraining = createAsyncThunk(
  "training/fetchTraining",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { training } = getState();
    if (!force && isCacheValid(training.lastFetchedAt, training.cacheTTLms)) {
      return { skip: true };
    }
    try {
      const response = await api.get("/api/training", { signal });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createTraining = createAsyncThunk(
  "training/createTraining",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.post("/api/training", payload, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return {
        data: response.data?.data || response.data,
        fetchedAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTraining = createAsyncThunk(
  "training/updateTraining",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.patch("/api/training", payload, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return {
        data: response.data?.data || response.data,
        fetchedAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTraining = createAsyncThunk(
  "training/deleteTraining",
  async ({ trainingId }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      await api.delete(`/api/training/${trainingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { trainingId, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    resetTraining: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTraining.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTraining.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.items = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(fetchTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch training";
      })
      .addCase(createTraining.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload.data);
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create training";
      })
      .addCase(updateTraining.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTraining.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) state.items[index] = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(updateTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update training";
      })
      .addCase(deleteTraining.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTraining.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.id !== action.payload.trainingId
        );
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(deleteTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete training";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectTraining = (state) => state.training;

export const selectTrainingItems = createSelector(
  selectTraining,
  (training) => training.items
);
export const selectTrainingStatus = createSelector(
  selectTraining,
  (training) => training.status
);
export const selectTrainingError = createSelector(
  selectTraining,
  (training) => training.error
);
export const selectIsTrainingLoading = createSelector(
  selectTraining,
  (training) => training.status === "loading"
);
export const selectHasTrainingData = createSelector(
  selectTraining,
  (training) => training.items.length > 0
);
export const selectIsTrainingStale = createSelector(
  selectTraining,
  (training) => !isCacheValid(training.lastFetchedAt, training.cacheTTLms)
);

export const { resetTraining, clearError, setCacheTTL } = trainingSlice.actions;
export default trainingSlice.reducer;
