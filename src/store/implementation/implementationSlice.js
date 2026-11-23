/**
 * Template slice for implementation endpoints
 * Based on Postman collection: /api/implementation/hero (GET/POST/PATCH/DELETE)
 * This can be adapted for integration, consulting, payroll following the same pattern
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

const initialState = {
  hero: { item: null, status: "idle", error: null, lastFetchedAt: null },
  // Add other implementation sections here as needed
  // services: { items: [], status: 'idle', error: null, lastFetchedAt: null },
  // features: { items: [], status: 'idle', error: null, lastFetchedAt: null },
  cacheTTLms: 5 * 60 * 1000,
};

const isCacheValid = (lastFetchedAt, cacheTTLms) => {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt < cacheTTLms;
};

// --- Implementation Hero Thunks ---
export const fetchImplementationHero = createAsyncThunk(
  "implementation/fetchHero",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { implementation } = getState();
    if (
      !force &&
      isCacheValid(implementation.hero.lastFetchedAt, implementation.cacheTTLms)
    ) {
      return { skip: true };
    }
    try {
      const response = await api.get("/api/implementation/hero", { signal });
      const data = response.data?.data || response.data || {};
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createImplementationHero = createAsyncThunk(
  "implementation/createHero",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.post("/api/implementation/hero", payload, {
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

export const updateImplementationHero = createAsyncThunk(
  "implementation/updateHero",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.patch("/api/implementation/hero", payload, {
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

export const deleteImplementationHero = createAsyncThunk(
  "implementation/deleteHero",
  async (_, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      await api.delete("/api/implementation/hero", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const implementationSlice = createSlice({
  name: "implementation",
  initialState,
  reducers: {
    resetImplementation: () => initialState,
    clearError: (state, action) => {
      const section = action.payload || "hero";
      if (state[section]) {
        state[section].error = null;
      }
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Hero section reducers
    builder
      .addCase(fetchImplementationHero.pending, (state) => {
        state.hero.status = "loading";
        state.hero.error = null;
      })
      .addCase(fetchImplementationHero.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.hero.status = "succeeded";
        state.hero.item = action.payload.data;
        state.hero.lastFetchedAt = action.payload.fetchedAt;
        state.hero.error = null;
      })
      .addCase(fetchImplementationHero.rejected, (state, action) => {
        state.hero.status = "failed";
        state.hero.error =
          action.payload?.message || "Failed to fetch implementation hero";
      })
      .addCase(createImplementationHero.pending, (state) => {
        state.hero.status = "loading";
        state.hero.error = null;
      })
      .addCase(createImplementationHero.fulfilled, (state, action) => {
        state.hero.status = "succeeded";
        state.hero.item = action.payload.data;
        state.hero.lastFetchedAt = action.payload.fetchedAt;
        state.hero.error = null;
      })
      .addCase(createImplementationHero.rejected, (state, action) => {
        state.hero.status = "failed";
        state.hero.error =
          action.payload?.message || "Failed to create implementation hero";
      })
      .addCase(updateImplementationHero.pending, (state) => {
        state.hero.status = "loading";
        state.hero.error = null;
      })
      .addCase(updateImplementationHero.fulfilled, (state, action) => {
        state.hero.status = "succeeded";
        state.hero.item = action.payload.data;
        state.hero.lastFetchedAt = action.payload.fetchedAt;
        state.hero.error = null;
      })
      .addCase(updateImplementationHero.rejected, (state, action) => {
        state.hero.status = "failed";
        state.hero.error =
          action.payload?.message || "Failed to update implementation hero";
      })
      .addCase(deleteImplementationHero.pending, (state) => {
        state.hero.status = "loading";
        state.hero.error = null;
      })
      .addCase(deleteImplementationHero.fulfilled, (state, action) => {
        state.hero.status = "succeeded";
        state.hero.item = null;
        state.hero.lastFetchedAt = action.payload.fetchedAt;
        state.hero.error = null;
      })
      .addCase(deleteImplementationHero.rejected, (state, action) => {
        state.hero.status = "failed";
        state.hero.error =
          action.payload?.message || "Failed to delete implementation hero";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectImplementation = (state) => state.implementation;

export const selectImplementationHeroItem = createSelector(
  selectImplementation,
  (impl) => impl.hero.item
);
export const selectImplementationHeroStatus = createSelector(
  selectImplementation,
  (impl) => impl.hero.status
);
export const selectImplementationHeroError = createSelector(
  selectImplementation,
  (impl) => impl.hero.error
);
export const selectIsImplementationHeroLoading = createSelector(
  selectImplementation,
  (impl) => impl.hero.status === "loading"
);
export const selectHasImplementationHeroData = createSelector(
  selectImplementation,
  (impl) => !!impl.hero.item
);
export const selectIsImplementationHeroStale = createSelector(
  selectImplementation,
  (impl) => !isCacheValid(impl.hero.lastFetchedAt, impl.cacheTTLms)
);

export const {
  resetImplementation,
  clearError,
  setCacheTTL,
} = implementationSlice.actions;
export default implementationSlice.reducer;

/*
 * COPY TEMPLATE: To create integration/consulting/payroll slices:
 * 1. Replace 'implementation' with the resource name throughout
 * 2. Update the API endpoint from '/api/implementation/hero' to appropriate endpoint
 * 3. Add additional sections to initialState as needed (e.g., services, features)
 * 4. Create corresponding thunks and reducers for each section
 * 5. Export appropriate selectors
 */
