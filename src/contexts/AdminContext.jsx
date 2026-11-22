import React, { createContext, useReducer, useEffect } from 'react';
import { staticContent } from "../services/StaticContentRepository";

// Action types
const ACTIONS = {
  SET_PAGES: 'SET_PAGES',
  ADD_PAGE: 'ADD_PAGE',
  UPDATE_PAGE: 'UPDATE_PAGE',
  DELETE_PAGE: 'DELETE_PAGE',
  SET_TEMPLATES: 'SET_TEMPLATES',
  ADD_TEMPLATE: 'ADD_TEMPLATE',
  UPDATE_TEMPLATE: 'UPDATE_TEMPLATE',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Initial state
const initialState = {
  pages: [],
  templates: [],
  loading: false,
  error: null,
};

// Reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PAGES:
      return { ...state, pages: action.payload, loading: false };
    case ACTIONS.ADD_PAGE:
      return { ...state, pages: [...state.pages, action.payload] };
    case ACTIONS.UPDATE_PAGE:
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.id ? action.payload : page
        ),
      };
    case ACTIONS.DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter(page => page.id !== action.payload),
      };
    case ACTIONS.SET_TEMPLATES:
      return { ...state, templates: action.payload };
    case ACTIONS.ADD_TEMPLATE:
      return { ...state, templates: [...state.templates, action.payload] };
    case ACTIONS.UPDATE_TEMPLATE:
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
      };
    case ACTIONS.DELETE_TEMPLATE:
      return {
        ...state,
        templates: state.templates.filter(template => template.id !== action.payload),
      };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Create context
const AdminContext = createContext();

// Context provider
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Mock API functions
  const api = {
    // Pages
    async fetchPages() {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const dataFiles = [
          'homeData.json',
          'Implementation.json',
          'training.json',
          'netSuiteConsulting.json',
          'customization.json',
          'integration-data.json',
          'hr.json',
          'payroll.json',
          'manufacturing-data.json',
          'retail-data.json',
        ];

        const pages = dataFiles.map((file, index) => ({
          id: index + 1,
          name: file.replace('.json', '').replace('-data', '').replace(/([A-Z])/g, ' $1').trim(),
          fileName: file,
          status: 'Published',
          template: 'default',
          sections: [],
          seo: {
            title: '',
            description: '',
            keywords: '',
          },
          lastModified: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          createdAt: new Date(Date.now() - Math.random() * 100000000000).toISOString(),
        }));

        dispatch({ type: ACTIONS.SET_PAGES, payload: pages });
        return pages;
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    async fetchPageData(fileName) {
      try {
        return await staticContent.load(fileName);
      } catch (error) {
        console.error('Error fetching page data:', error);
        return null;
      }
    },

    async createPage(pageData) {
      // In a real implementation, this would save to backend/filesystem
      const newPage = {
        ...pageData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'Draft',
      };
      dispatch({ type: ACTIONS.ADD_PAGE, payload: newPage });
      return newPage;
    },

    async updatePage(id, pageData) {
      const updatedPage = {
        ...pageData,
        id,
        lastModified: new Date().toISOString(),
      };
      dispatch({ type: ACTIONS.UPDATE_PAGE, payload: updatedPage });
      return updatedPage;
    },

    async deletePage(id) {
      dispatch({ type: ACTIONS.DELETE_PAGE, payload: id });
      return true;
    },

    // Templates
    async fetchTemplates() {
      const templates = [
        {
          id: 1,
          name: 'Landing Page',
          description: 'Complete landing page with hero, features, and CTA',
          category: 'Page',
          sections: ['hero', 'features', 'testimonials', 'cta'],
          preview: '/images/templates/landing.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Service Page',
          description: 'Service detail page with process and pricing',
          category: 'Page',
          sections: ['hero', 'process', 'features', 'pricing', 'cta'],
          preview: '/images/templates/service.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'About Page',
          description: 'Company about page with team and journey',
          category: 'Page',
          sections: ['hero', 'about', 'team', 'journey'],
          preview: '/images/templates/about.jpg',
          createdAt: new Date().toISOString(),
        },
        // Section templates
        {
          id: 4,
          name: 'Hero Section',
          description: 'Eye-catching hero section with video background',
          category: 'Section',
          type: 'hero',
          fields: ['title', 'subtitle', 'description', 'video', 'cta'],
          preview: '/images/templates/hero.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 5,
          name: 'Features Grid',
          description: '3-column features showcase',
          category: 'Section',
          type: 'features',
          fields: ['title', 'subtitle', 'features'],
          preview: '/images/templates/features.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 6,
          name: 'Testimonials Carousel',
          description: 'Customer testimonials with ratings',
          category: 'Section',
          type: 'testimonials',
          fields: ['title', 'testimonials'],
          preview: '/images/templates/testimonials.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 7,
          name: 'Pricing Table',
          description: 'Responsive pricing plans comparison',
          category: 'Section',
          type: 'pricing',
          fields: ['title', 'subtitle', 'plans'],
          preview: '/images/templates/pricing.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 8,
          name: 'Contact CTA',
          description: 'Call-to-action with contact form',
          category: 'Section',
          type: 'cta',
          fields: ['title', 'subtitle', 'button', 'features'],
          preview: '/images/templates/cta.jpg',
          createdAt: new Date().toISOString(),
        },
      ];

      dispatch({ type: ACTIONS.SET_TEMPLATES, payload: templates });
      return templates;
    },

    async createTemplate(templateData) {
      const newTemplate = {
        ...templateData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: ACTIONS.ADD_TEMPLATE, payload: newTemplate });
      return newTemplate;
    },

    async updateTemplate(id, templateData) {
      const updatedTemplate = {
        ...templateData,
        id,
      };
      dispatch({ type: ACTIONS.UPDATE_TEMPLATE, payload: updatedTemplate });
      return updatedTemplate;
    },

    async deleteTemplate(id) {
      dispatch({ type: ACTIONS.DELETE_TEMPLATE, payload: id });
      return true;
    },

    // File operations (mock)
    async saveDataFile(fileName, data) {
      // In a real implementation, this would save to backend/filesystem
      console.log('Saving data to file:', fileName, data);
      return true;
    },

    async createDataFile(fileName, data) {
      // In a real implementation, this would create new file
      console.log('Creating new data file:', fileName, data);
      return true;
    },

    async deleteDataFile(fileName) {
      // In a real implementation, this would delete file
      console.log('Deleting data file:', fileName);
      return true;
    },
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      await api.fetchPages();
      await api.fetchTemplates();
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    ...state,
    api,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
