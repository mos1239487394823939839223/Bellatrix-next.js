import { configureStore } from "@reduxjs/toolkit";

// Import all slice reducers
import authReducer from "./auth/authSlice";
import heroReducer from "./hero/heroSlice";
import servicesReducer from "./landing/servicesSlice";
import testimonialsReducer from "./landing/testimonialsSlice";
import industriesReducer from "./landing/industriesSlice";
import contentReducer from "./content/contentSlice";
import trainingReducer from "./training/trainingSlice";
import aboutReducer from "./about/aboutSlice";
import implementationReducer from "./implementation/implementationSlice";
// TODO: Add integration, consulting, payroll reducers when created

const store = configureStore({
  reducer: {
    auth: authReducer,
    hero: heroReducer,
    services: servicesReducer,
    testimonials: testimonialsReducer,
    industries: industriesReducer,
    content: contentReducer, // Contains modal, cta, pricing, process, whyChoose
    training: trainingReducer,
    about: aboutReducer,
    implementation: implementationReducer,
    // TODO: Uncomment when slices are created
    // integration: integrationReducer,
    // consulting: consultingReducer,
    // payroll: payrollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore AbortController signal in actions
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["payload.signal"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
