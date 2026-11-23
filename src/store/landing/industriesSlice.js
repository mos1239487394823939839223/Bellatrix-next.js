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
export const fetchIndustries = createAsyncThunk(
  "industries/fetchIndustries",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { industries } = getState();
    if (
      !force &&
      isCacheValid(industries.lastFetchedAt, industries.cacheTTLms)
    ) {
      return { skip: true };
    }
    try {
      const response = await api.get("/api/landing/industries", { signal });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createIndustry = createAsyncThunk(
  "industries/createIndustry",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.post("/api/landing/industries", payload, {
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

export const updateIndustry = createAsyncThunk(
  "industries/updateIndustry",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.patch("/api/landing/industries", payload, {
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

export const deleteIndustry = createAsyncThunk(
  "industries/deleteIndustry",
  async ({ industryId }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      await api.delete(`/api/landing/industries/${industryId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { industryId, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const industriesSlice = createSlice({
  name: "industries",
  initialState,
  reducers: {
    resetIndustries: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.items = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch industries";
      })
      .addCase(createIndustry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createIndustry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload.data);
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createIndustry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create industry";
      })
      .addCase(updateIndustry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) state.items[index] = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(updateIndustry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update industry";
      })
      .addCase(deleteIndustry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.id !== action.payload.industryId
        );
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete industry";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectIndustries = (state) => state.industries;

export const selectIndustriesItems = createSelector(
  selectIndustries,
  (industries) => industries.items
);
export const selectIndustriesStatus = createSelector(
  selectIndustries,
  (industries) => industries.status
);
export const selectIndustriesError = createSelector(
  selectIndustries,
  (industries) => industries.error
);
export const selectIsIndustriesLoading = createSelector(
  selectIndustries,
  (industries) => industries.status === "loading"
);
export const selectHasIndustriesData = createSelector(
  selectIndustries,
  (industries) => industries.items.length > 0
);
export const selectIsIndustriesStale = createSelector(
  selectIndustries,
  (industries) => !isCacheValid(industries.lastFetchedAt, industries.cacheTTLms)
);

export const {
  resetIndustries,
  clearError,
  setCacheTTL,
} = industriesSlice.actions;
export default industriesSlice.reducer;
