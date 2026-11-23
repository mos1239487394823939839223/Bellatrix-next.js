import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getAuthTokenFromState } from "../../services/legacy/api";

/**
 * Content slice handles multiple single-object endpoints:
 * - Modal content (/api/modal-content)
 * - CTA section (/api/cta-section)
 * - Pricing section (/api/pricing-section)
 * - Process section (/api/process-section)
 * - Why choose section (/api/why-choose-section)
 */

const initialState = {
  modal: { item: null, status: "idle", error: null, lastFetchedAt: null },
  cta: { item: null, status: "idle", error: null, lastFetchedAt: null },
  pricing: { item: null, status: "idle", error: null, lastFetchedAt: null },
  process: { item: null, status: "idle", error: null, lastFetchedAt: null },
  whyChoose: { item: null, status: "idle", error: null, lastFetchedAt: null },
  cacheTTLms: 5 * 60 * 1000,
};

const isCacheValid = (lastFetchedAt, cacheTTLms) => {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt < cacheTTLms;
};

// Generic thunk creator for content sections
const createContentThunks = (sectionName, endpoint) => {
  const fetch = createAsyncThunk(
    `content/fetch${sectionName}`,
    async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
      const section = getState().content[sectionName.toLowerCase()];
      if (
        !force &&
        isCacheValid(section.lastFetchedAt, getState().content.cacheTTLms)
      ) {
        return { skip: true };
      }
      try {
        const response = await api.get(endpoint, { signal });
        const data = response.data?.data || response.data || {};
        return { data, fetchedAt: Date.now() };
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

  const create = createAsyncThunk(
    `content/create${sectionName}`,
    async ({ payload }, { getState, signal, rejectWithValue }) => {
      const token = getAuthTokenFromState(getState());
      if (!token)
        return rejectWithValue({ message: "Authentication required" });
      try {
        const response = await api.post(endpoint, payload, {
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

  const update = createAsyncThunk(
    `content/update${sectionName}`,
    async ({ payload }, { getState, signal, rejectWithValue }) => {
      const token = getAuthTokenFromState(getState());
      if (!token)
        return rejectWithValue({ message: "Authentication required" });
      try {
        const response = await api.patch(endpoint, payload, {
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

  const remove = createAsyncThunk(
    `content/delete${sectionName}`,
    async (_, { getState, signal, rejectWithValue }) => {
      const token = getAuthTokenFromState(getState());
      if (!token)
        return rejectWithValue({ message: "Authentication required" });
      try {
        await api.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        return { fetchedAt: Date.now() };
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

  return { fetch, create, update, remove };
};

// Create thunks for each content section
export const modal = createContentThunks("Modal", "/api/modal-content");
export const cta = createContentThunks("Cta", "/api/cta-section");
export const pricing = createContentThunks("Pricing", "/api/pricing-section");
export const process = createContentThunks("Process", "/api/process-section");
export const whyChoose = createContentThunks(
  "WhyChoose",
  "/api/why-choose-section"
);

// Helper to create reducers for each section
const createSectionReducers = (sectionKey, thunks) => ({
  // Fetch
  [`${thunks.fetch.pending}`]: (state) => {
    state[sectionKey].status = "loading";
    state[sectionKey].error = null;
  },
  [`${thunks.fetch.fulfilled}`]: (state, action) => {
    if (action.payload?.skip) return;
    state[sectionKey].status = "succeeded";
    state[sectionKey].item = action.payload.data;
    state[sectionKey].lastFetchedAt = action.payload.fetchedAt;
    state[sectionKey].error = null;
  },
  [`${thunks.fetch.rejected}`]: (state, action) => {
    state[sectionKey].status = "failed";
    state[sectionKey].error =
      action.payload?.message || `Failed to fetch ${sectionKey}`;
  },
  // Create
  [`${thunks.create.pending}`]: (state) => {
    state[sectionKey].status = "loading";
    state[sectionKey].error = null;
  },
  [`${thunks.create.fulfilled}`]: (state, action) => {
    state[sectionKey].status = "succeeded";
    state[sectionKey].item = action.payload.data;
    state[sectionKey].lastFetchedAt = action.payload.fetchedAt;
    state[sectionKey].error = null;
  },
  [`${thunks.create.rejected}`]: (state, action) => {
    state[sectionKey].status = "failed";
    state[sectionKey].error =
      action.payload?.message || `Failed to create ${sectionKey}`;
  },
  // Update
  [`${thunks.update.pending}`]: (state) => {
    state[sectionKey].status = "loading";
    state[sectionKey].error = null;
  },
  [`${thunks.update.fulfilled}`]: (state, action) => {
    state[sectionKey].status = "succeeded";
    state[sectionKey].item = action.payload.data;
    state[sectionKey].lastFetchedAt = action.payload.fetchedAt;
    state[sectionKey].error = null;
  },
  [`${thunks.update.rejected}`]: (state, action) => {
    state[sectionKey].status = "failed";
    state[sectionKey].error =
      action.payload?.message || `Failed to update ${sectionKey}`;
  },
  // Delete
  [`${thunks.remove.pending}`]: (state) => {
    state[sectionKey].status = "loading";
    state[sectionKey].error = null;
  },
  [`${thunks.remove.fulfilled}`]: (state, action) => {
    state[sectionKey].status = "succeeded";
    state[sectionKey].item = null;
    state[sectionKey].lastFetchedAt = action.payload.fetchedAt;
    state[sectionKey].error = null;
  },
  [`${thunks.remove.rejected}`]: (state, action) => {
    state[sectionKey].status = "failed";
    state[sectionKey].error =
      action.payload?.message || `Failed to delete ${sectionKey}`;
  },
});

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    resetContent: () => initialState,
    clearError: (state, action) => {
      const section = action.payload;
      if (section && state[section]) {
        state[section].error = null;
      }
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for each section
    const allReducers = {
      ...createSectionReducers("modal", modal),
      ...createSectionReducers("cta", cta),
      ...createSectionReducers("pricing", pricing),
      ...createSectionReducers("process", process),
      ...createSectionReducers("whyChoose", whyChoose),
    };

    // Apply all reducers using addMatcher
    Object.entries(allReducers).forEach(([actionType, reducer]) => {
      builder.addMatcher((action) => action.type === actionType, reducer);
    });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectContent = (state) => state.content;

// Generic selector creator
const createSectionSelectors = (sectionKey) => ({
  [`select${
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }Item`]: createSelector(selectContent, (content) => content[sectionKey].item),
  [`select${
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }Status`]: createSelector(
    selectContent,
    (content) => content[sectionKey].status
  ),
  [`select${
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }Error`]: createSelector(
    selectContent,
    (content) => content[sectionKey].error
  ),
  [`selectIs${
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }Loading`]: createSelector(
    selectContent,
    (content) => content[sectionKey].status === "loading"
  ),
  [`selectHas${
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }Data`]: createSelector(
    selectContent,
    (content) => !!content[sectionKey].item
  ),
  [`selectIs${
    sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)
  }Stale`]: createSelector(
    selectContent,
    (content) =>
      !isCacheValid(content[sectionKey].lastFetchedAt, content.cacheTTLms)
  ),
});

// Export selectors for each section
export const modalSelectors = createSectionSelectors("modal");
export const ctaSelectors = createSectionSelectors("cta");
export const pricingSelectors = createSectionSelectors("pricing");
export const processSelectors = createSectionSelectors("process");
export const whyChooseSelectors = createSectionSelectors("whyChoose");

// Global content selectors
export const selectIsAnyContentLoading = createSelector(
  selectContent,
  (content) =>
    Object.values(content).some(
      (section) => typeof section === "object" && section.status === "loading"
    )
);

export const selectAllContentErrors = createSelector(
  selectContent,
  (content) => {
    const errors = {};
    Object.entries(content).forEach(([key, section]) => {
      if (typeof section === "object" && section.error) {
        errors[key] = section.error;
      }
    });
    return errors;
  }
);

export const { resetContent, clearError, setCacheTTL } = contentSlice.actions;
export default contentSlice.reducer;
