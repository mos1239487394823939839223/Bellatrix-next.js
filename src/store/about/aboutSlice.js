import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

const initialState = {
  item: null, // About is typically a single object
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
export const fetchAbout = createAsyncThunk(
  "about/fetchAbout",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { about } = getState();
    if (!force && isCacheValid(about.lastFetchedAt, about.cacheTTLms)) {
      return { skip: true };
    }
    try {
      const response = await api.get("/about", { signal });
      const data = response.data?.data || response.data || {};
      return { data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createAbout = createAsyncThunk(
  "about/createAbout",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.post("/about", payload, {
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

export const updateAbout = createAsyncThunk(
  "about/updateAbout",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      const response = await api.patch("/about", payload, {
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

export const deleteAbout = createAsyncThunk(
  "about/deleteAbout",
  async (_, { getState, signal, rejectWithValue }) => {
    const token = getAuthTokenFromState(getState());
    if (!token) return rejectWithValue({ message: "Authentication required" });
    try {
      await api.delete("/about", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      return { fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    resetAbout: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.item = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch about";
      })
      .addCase(createAbout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createAbout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createAbout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create about";
      })
      .addCase(updateAbout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateAbout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(updateAbout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update about";
      })
      .addCase(deleteAbout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAbout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = null;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(deleteAbout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete about";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectAbout = (state) => state.about;

export const selectAboutItem = createSelector(
  selectAbout,
  (about) => about.item
);
export const selectAboutStatus = createSelector(
  selectAbout,
  (about) => about.status
);
export const selectAboutError = createSelector(
  selectAbout,
  (about) => about.error
);
export const selectIsAboutLoading = createSelector(
  selectAbout,
  (about) => about.status === "loading"
);
export const selectHasAboutData = createSelector(
  selectAbout,
  (about) => !!about.item
);
export const selectIsAboutStale = createSelector(
  selectAbout,
  (about) => !isCacheValid(about.lastFetchedAt, about.cacheTTLms)
);

export const { resetAbout, clearError, setCacheTTL } = aboutSlice.actions;
export default aboutSlice.reducer;
