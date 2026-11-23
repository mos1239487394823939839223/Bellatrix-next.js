import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

/**
 * @typedef {'idle' | 'loading' | 'succeeded' | 'failed'} LoadStatus
 * @typedef {Object} HeroState
 * @property {Object|null} item - Hero data (single object)
 * @property {LoadStatus} status
 * @property {string|null} error
 * @property {number|null} lastFetchedAt
 * @property {number} cacheTTLms
 */

const initialState = {
  item: null, // Hero is a single object, not an array
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
export const fetchHero = createAsyncThunk(
  "hero/fetchHero",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { hero } = getState();

    if (!force && isCacheValid(hero.lastFetchedAt, hero.cacheTTLms)) {
      return { skip: true };
    }

    try {
      const response = await api.get("/api/landing/hero", { signal });
      const data = response.data?.data || response.data;
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createHero = createAsyncThunk(
  "hero/createHero",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());

    if (!token) {
      return rejectWithValue({ message: "Authentication required" });
    }

    try {
      const response = await api.post("/api/landing/hero", payload, {
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

export const updateHero = createAsyncThunk(
  "hero/updateHero",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());

    if (!token) {
      return rejectWithValue({ message: "Authentication required" });
    }

    try {
      const response = await api.patch("/api/landing/hero", payload, {
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

export const deleteHero = createAsyncThunk(
  "hero/deleteHero",
  async (_, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());

    if (!token) {
      return rejectWithValue({ message: "Authentication required" });
    }

    try {
      await api.delete("/api/landing/hero", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const heroSlice = createSlice({
  name: "hero",
  initialState,
  reducers: {
    resetHero: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- Fetch Hero ---
    builder
      .addCase(fetchHero.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHero.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.item = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(fetchHero.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch hero";
      })
      // --- Create Hero ---
      .addCase(createHero.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createHero.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createHero.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create hero";
      })
      // --- Update Hero ---
      .addCase(updateHero.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(updateHero.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update hero";
      })
      // --- Delete Hero ---
      .addCase(deleteHero.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteHero.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = null;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(deleteHero.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete hero";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectHero = (state) => state.hero;

export const selectHeroItem = createSelector(selectHero, (hero) => hero.item);
export const selectHeroStatus = createSelector(
  selectHero,
  (hero) => hero.status
);
export const selectHeroError = createSelector(selectHero, (hero) => hero.error);
export const selectIsHeroLoading = createSelector(
  selectHero,
  (hero) => hero.status === "loading"
);
export const selectHasHeroData = createSelector(
  selectHero,
  (hero) => !!hero.item
);
export const selectIsHeroStale = createSelector(
  selectHero,
  (hero) => !isCacheValid(hero.lastFetchedAt, hero.cacheTTLms)
);

export const { resetHero, clearError, setCacheTTL } = heroSlice.actions;
export default heroSlice.reducer;
