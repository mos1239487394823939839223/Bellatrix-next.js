import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

/**
 * @typedef {'idle' | 'loading' | 'succeeded' | 'failed'} LoadStatus
 * @typedef {Object} TestimonialsState
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
  cacheTTLms: 5 * 60 * 1000,
};

const isCacheValid = (lastFetchedAt, cacheTTLms) => {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt < cacheTTLms;
};

// --- Async Thunks ---
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchTestimonials",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { testimonials } = getState();
    if (
      !force &&
      isCacheValid(testimonials.lastFetchedAt, testimonials.cacheTTLms)
    ) {
      return { skip: true };
    }
    try {
      const response = await api.get("/api/landing/testimonials", { signal });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createTestimonial = createAsyncThunk(
  "testimonials/createTestimonial",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.post("/api/landing/testimonials", payload, {
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

export const updateTestimonial = createAsyncThunk(
  "testimonials/updateTestimonial",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.patch("/api/landing/testimonials", payload, {
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

export const deleteTestimonial = createAsyncThunk(
  "testimonials/deleteTestimonial",
  async ({ testimonialId }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      await api.delete(`/api/landing/testimonials/${testimonialId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { testimonialId, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    resetTestimonials: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.items = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch testimonials";
      })
      .addCase(createTestimonial.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload.data);
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create testimonial";
      })
      .addCase(updateTestimonial.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) state.items[index] = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update testimonial";
      })
      .addCase(deleteTestimonial.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.id !== action.payload.testimonialId
        );
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete testimonial";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectTestimonials = (state) => state.testimonials;

export const selectTestimonialsItems = createSelector(
  selectTestimonials,
  (testimonials) => testimonials.items
);
export const selectTestimonialsStatus = createSelector(
  selectTestimonials,
  (testimonials) => testimonials.status
);
export const selectTestimonialsError = createSelector(
  selectTestimonials,
  (testimonials) => testimonials.error
);
export const selectIsTestimonialsLoading = createSelector(
  selectTestimonials,
  (testimonials) => testimonials.status === "loading"
);
export const selectHasTestimonialsData = createSelector(
  selectTestimonials,
  (testimonials) => testimonials.items.length > 0
);
export const selectIsTestimonialsStale = createSelector(
  selectTestimonials,
  (testimonials) =>
    !isCacheValid(testimonials.lastFetchedAt, testimonials.cacheTTLms)
);

export const {
  resetTestimonials,
  clearError,
  setCacheTTL,
} = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
