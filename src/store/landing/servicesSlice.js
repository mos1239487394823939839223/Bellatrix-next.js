import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

/**
 * @typedef {'idle' | 'loading' | 'succeeded' | 'failed'} LoadStatus
 * @typedef {Object} ServicesState
 * @property {any[]} items
 * @property {LoadStatus} status
 * @property {string|null} error
 * @property {number|null} lastFetchedAt
 * @property {number} cacheTTLms
 */

const initialState = {
  items: [],
  status: "idle",
  error: null,
  lastFetchedAt: null,
  cacheTTLms: 5 * 60 * 1000, // 5 minutes
};

// Helper: check cache validity
const isCacheValid = (lastFetchedAt, cacheTTLms) => {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt < cacheTTLms;
};

// --- Async Thunks ---
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { services } = getState();

    if (!force && isCacheValid(services.lastFetchedAt, services.cacheTTLms)) {
      return { skip: true };
    }

    try {
      const response = await api.get("/api/landing/services", { signal });
      // Normalize response to guarantee array
      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());

    if (!token) {
      return rejectWithValue({ message: "Authentication required" });
    }

    try {
      const response = await api.post("/api/landing/services", payload, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = response.data?.data || response.data;
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());

    if (!token) {
      return rejectWithValue({ message: "Authentication required" });
    }

    try {
      const response = await api.patch("/api/landing/services", payload, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = response.data?.data || response.data;
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async ({ serviceId }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());

    if (!token) {
      return rejectWithValue({ message: "Authentication required" });
    }

    try {
      await api.delete(`/api/landing/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { serviceId, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    resetServices: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- Fetch Services ---
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.items = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch services";
      })
      // --- Create Service ---
      .addCase(createService.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload.data);
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create service";
      })
      // --- Update Service ---
      .addCase(updateService.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update service";
      })
      // --- Delete Service ---
      .addCase(deleteService.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.id !== action.payload.serviceId
        );
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete service";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectServices = (state) => state.services;

export const selectServicesItems = createSelector(
  selectServices,
  (services) => services.items
);
export const selectServicesStatus = createSelector(
  selectServices,
  (services) => services.status
);
export const selectServicesError = createSelector(
  selectServices,
  (services) => services.error
);
export const selectIsServicesLoading = createSelector(
  selectServices,
  (services) => services.status === "loading"
);
export const selectHasServicesData = createSelector(
  selectServices,
  (services) => services.items.length > 0
);
export const selectIsServicesStale = createSelector(
  selectServices,
  (services) => !isCacheValid(services.lastFetchedAt, services.cacheTTLms)
);

// Legacy selectors for backward compatibility
export const selectServiceLinks = createSelector(selectServicesItems, (items) =>
  items.map((service) => ({
    slug: service.slug,
    name: service.name,
  }))
);

export const { resetServices, clearError, setCacheTTL } = servicesSlice.actions;
export default servicesSlice.reducer;
