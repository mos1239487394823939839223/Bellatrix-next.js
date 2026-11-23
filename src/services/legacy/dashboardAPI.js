import api from "./api.js";

// Check if we're in development mode and should use local fallback
const isDevelopment = process.env.NODE_ENV === 'development';
const LOCAL_FALLBACK = true; // Set to true to enable local fallback for testing

/**
 * Dashboard API service for handling dashboard-related operations
 */
const dashboardAPI = {
  /**
   * Get dashboard statistics including pages, media, and contact messages
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Fetch all statistics in parallel
      const [pagesStats, mediaStats, contactStats] = await Promise.all([
        this.getPagesStats(),
        this.getMediaStats(),
        this.getContactStats()
      ]);

      return {
        pages: pagesStats,
        media: mediaStats,
        contact: contactStats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      
      // Return fallback data if API is not available
      if (LOCAL_FALLBACK) {
        console.log("Using fallback dashboard data");
        return this.getFallbackStats();
      }
      
      throw error;
    }
  },

  /**
   * Get fallback statistics for when API is not available
   * @returns {Object} Fallback statistics
   */
  getFallbackStats() {
    return {
      pages: {
        total: 12,
        published: 8,
        unpublished: 4,
        homepage: 1,
        recent: []
      },
      media: {
        totalMedia: 45,
        totalImages: 32,
        totalVideos: 8,
        totalDocuments: 3,
        totalAudio: 2,
        totalSizeInBytes: 15728640,
        totalSizeFormatted: "15 MB"
      },
      contact: {
        totalMessages: 23,
        unrepliedMessages: 5,
        repliedMessages: 18,
        messagesToday: 3,
        messagesThisWeek: 8,
        messagesThisMonth: 23
      },
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Get pages statistics
   * @returns {Promise<Object>} Pages statistics
   */
  async getPagesStats() {
    try {
      const response = await api.get("/Pages");
      const pages = Array.isArray(response.data) ? response.data : [];
      
      const publishedPages = pages.filter(page => page.isPublished);
      const unpublishedPages = pages.filter(page => !page.isPublished);
      const homepageCount = pages.filter(page => page.isHomepage).length;

      return {
        total: pages.length,
        published: publishedPages.length,
        unpublished: unpublishedPages.length,
        homepage: homepageCount,
        recent: pages.slice(0, 5) // Get 5 most recent pages
      };
    } catch (error) {
      console.error("Error fetching pages stats:", error);
      throw error;
    }
  },

  /**
   * Get media statistics
   * @returns {Promise<Object>} Media statistics
   */
  async getMediaStats() {
    try {
      const response = await api.get("/Media/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching media stats:", error);
      // Return fallback data if endpoint fails
      return {
        totalMedia: 0,
        totalImages: 0,
        totalVideos: 0,
        totalDocuments: 0,
        totalAudio: 0,
        totalSizeInBytes: 0,
        totalSizeFormatted: "0 B"
      };
    }
  },

  /**
   * Get contact messages statistics
   * @returns {Promise<Object>} Contact messages statistics
   */
  async getContactStats() {
    try {
      const response = await api.get("/ContactMessages/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact stats:", error);
      // Return fallback data if endpoint fails
      return {
        totalMessages: 0,
        unrepliedMessages: 0,
        repliedMessages: 0,
        messagesToday: 0,
        messagesThisWeek: 0,
        messagesThisMonth: 0
      };
    }
  },

  /**
   * Get recent contact messages for activity feed
   * @param {number} count - Number of recent messages to fetch (default: 5)
   * @returns {Promise<Array>} Recent contact messages
   */
  async getRecentContactMessages(count = 5) {
    try {
      const response = await api.get(`/ContactMessages/recent?count=${count}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching recent contact messages:", error);
      
      // Return fallback data if API is not available
      if (LOCAL_FALLBACK) {
        return this.getFallbackRecentMessages(count);
      }
      
      return [];
    }
  },

  /**
   * Get fallback recent contact messages
   * @param {number} count - Number of messages to return
   * @returns {Array} Fallback recent messages
   */
  getFallbackRecentMessages(count = 5) {
    const fallbackMessages = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        subject: "Website Inquiry",
        message: "I'm interested in your services...",
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        isReplied: false
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Support Request",
        message: "Need help with my account...",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        isReplied: true
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        subject: "Partnership Inquiry",
        message: "Would like to discuss partnership...",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isReplied: false
      }
    ];
    
    return fallbackMessages.slice(0, count);
  },

  /**
   * Get recent pages for activity feed
   * @param {number} count - Number of recent pages to fetch (default: 5)
   * @returns {Promise<Array>} Recent pages
   */
  async getRecentPages(count = 5) {
    try {
      const response = await api.get("/Pages");
      const pages = Array.isArray(response.data) ? response.data : [];
      
      // Sort by creation date (assuming there's a createdAt field)
      // If no createdAt field, we'll use the order they come from API
      return pages.slice(0, count);
    } catch (error) {
      console.error("Error fetching recent pages:", error);
      
      // Return fallback data if API is not available
      if (LOCAL_FALLBACK) {
        return this.getFallbackRecentPages(count);
      }
      
      return [];
    }
  },

  /**
   * Get fallback recent pages
   * @param {number} count - Number of pages to return
   * @returns {Array} Fallback recent pages
   */
  getFallbackRecentPages(count = 5) {
    const fallbackPages = [
      {
        id: 1,
        name: "About Us",
        title: "About Us",
        slug: "about-us",
        isPublished: true,
        isHomepage: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        categoryName: "Company"
      },
      {
        id: 2,
        name: "Services",
        title: "Our Services",
        slug: "services",
        isPublished: true,
        isHomepage: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        categoryName: "Services"
      },
      {
        id: 3,
        name: "Contact",
        title: "Contact Us",
        slug: "contact",
        isPublished: false,
        isHomepage: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        categoryName: "Company"
      }
    ];
    
    return fallbackPages.slice(0, count);
  },

  /**
   * Get system status information
   * @returns {Promise<Object>} System status
   */
  async getSystemStatus() {
    try {
      // This would typically check various system endpoints
      // For now, we'll return a basic status
      const [pagesResponse, mediaResponse] = await Promise.allSettled([
        api.get("/Pages"),
        api.get("/Media")
      ]);

      return {
        website: {
          status: "online",
          message: "Operational"
        },
        database: {
          status: pagesResponse.status === "fulfilled" ? "connected" : "error",
          message: pagesResponse.status === "fulfilled" ? "Connected" : "Connection failed"
        },
        media: {
          status: mediaResponse.status === "fulfilled" ? "online" : "error",
          message: mediaResponse.status === "fulfilled" ? "Available" : "Unavailable"
        },
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error checking system status:", error);
      
      // Return fallback data if API is not available
      if (LOCAL_FALLBACK) {
        return this.getFallbackSystemStatus();
      }
      
      return {
        website: { status: "unknown", message: "Unable to check" },
        database: { status: "unknown", message: "Unable to check" },
        media: { status: "unknown", message: "Unable to check" },
        lastChecked: new Date().toISOString()
      };
    }
  },

  /**
   * Get fallback system status
   * @returns {Object} Fallback system status
   */
  getFallbackSystemStatus() {
    return {
      website: {
        status: "online",
        message: "Operational"
      },
      database: {
        status: "connected",
        message: "Connected"
      },
      media: {
        status: "online",
        message: "Available"
      },
      lastChecked: new Date().toISOString()
    };
  }
};

export default dashboardAPI;
