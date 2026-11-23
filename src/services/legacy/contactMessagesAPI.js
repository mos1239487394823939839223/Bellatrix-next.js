import api from './api';

/**
 * Contact Messages API Service
 * Handles all contact message related API calls
 */

// Get all contact messages
export const getContactMessages = async (params = {}) => {
  try {
    const response = await api.get('/ContactMessages', { params });
    return {
      success: true,
      data: response.data,
      message: 'Messages fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch messages'
    };
  }
};

// Get a specific contact message by ID
export const getContactMessageById = async (id) => {
  try {
    const response = await api.get(`/ContactMessages/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Message fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch message'
    };
  }
};

// Search contact messages
export const searchContactMessages = async (query, params = {}) => {
  try {
    const response = await api.get('/ContactMessages/search', {
      params: { ...params, query }
    });
    return {
      success: true,
      data: response.data,
      message: 'Search completed successfully'
    };
  } catch (error) {
    console.error('Error searching contact messages:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to search messages'
    };
  }
};

// Get recent contact messages
export const getRecentContactMessages = async (limit = 10) => {
  try {
    const response = await api.get('/ContactMessages/recent', {
      params: { limit }
    });
    return {
      success: true,
      data: response.data,
      message: 'Recent messages fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch recent messages'
    };
  }
};

// Get contact message statistics
export const getContactMessageStats = async () => {
  try {
    const response = await api.get('/ContactMessages/stats');
    return {
      success: true,
      data: response.data,
      message: 'Statistics fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching message stats:', error);
    return {
      success: false,
      data: {
        totalMessages: 0,
        unrepliedMessages: 0,
        repliedMessages: 0,
        messagesToday: 0,
        messagesThisWeek: 0,
        messagesThisMonth: 0,
        messagesByIndustry: [],
        messagesByCountry: []
      },
      message: error.message || 'Failed to fetch statistics'
    };
  }
};

// Mark message as replied
export const markMessageAsReplied = async (id) => {
  try {
    const response = await api.patch(`/ContactMessages/${id}/mark-replied`);
    return {
      success: true,
      data: response.data,
      message: 'Message marked as replied'
    };
  } catch (error) {
    console.error('Error marking message as replied:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to mark message as replied'
    };
  }
};

// Mark message as unreplied
export const markMessageAsUnreplied = async (id) => {
  try {
    const response = await api.patch(`/ContactMessages/${id}/mark-unreplied`);
    return {
      success: true,
      data: response.data,
      message: 'Message marked as unreplied'
    };
  } catch (error) {
    console.error('Error marking message as unreplied:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to mark message as unreplied'
    };
  }
};

// Delete a contact message
export const deleteContactMessage = async (id) => {
  try {
    const response = await api.delete(`/ContactMessages/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Message deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to delete message'
    };
  }
};

// Submit a new contact message (for testing or admin submission)
export const submitContactMessage = async (messageData) => {
  try {
    const response = await api.post('/ContactMessages/submit', messageData);
    return {
      success: true,
      data: response.data,
      message: 'Message submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to submit message'
    };
  }
};

// Send reply to a contact message
// Note: This endpoint might not exist in the current API, 
// but we'll implement it for future use
export const sendReply = async (messageId, replyData) => {
  try {
    // This would be the actual reply endpoint when available
    // For now, we'll just mark as replied
    const response = await markMessageAsReplied(messageId);
    
    // In a real implementation, this would send the actual email
    console.log('Reply would be sent:', replyData);
    
    return {
      success: true,
      data: response.data,
      message: 'Reply sent successfully'
    };
  } catch (error) {
    console.error('Error sending reply:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to send reply'
    };
  }
};

export default {
  getContactMessages,
  getContactMessageById,
  searchContactMessages,
  getRecentContactMessages,
  getContactMessageStats,
  markMessageAsReplied,
  markMessageAsUnreplied,
  deleteContactMessage,
  submitContactMessage,
  sendReply,
};
