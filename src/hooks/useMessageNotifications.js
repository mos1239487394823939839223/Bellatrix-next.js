import { useState, useEffect, useCallback } from 'react';

import api from '../lib/api';



export const useMessageNotifications = () => {

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [isConnected, setIsConnected] = useState(false);



  // Debug authentication status

  useEffect(() => {

    // Auth debug disabled

  }, []);



  // Fetch initial unread count

  const fetchUnreadCount = useCallback(async () => {

    try {

      const response = await api.get('/ContactMessages/stats');

      // console.log(' [MESSAGE STATS] Response:', response.data);

      

      // Handle different response structures

      if (response.data && typeof response.data === 'object') {

        if (response.data.success && response.data.data) {

          setUnreadCount(response.data.data.unrepliedMessages || 0);

        } else if (response.data.unrepliedMessages !== undefined) {

          setUnreadCount(response.data.unrepliedMessages || 0);

        }

      }

    } catch (error) {

      console.error('Error fetching message stats:', error);

      

      // If it's a 401 error, the user might not be authenticated

      if (error.status === 401) {

        console.warn(' [AUTH WARNING] User not authenticated for message stats');

        // Don't set unread count, keep it at 0

      }

    }

  }, []);



  // Check for new messages (simulate real-time updates)

  const checkForNewMessages = useCallback(async () => {

    try {

      const response = await api.get('/ContactMessages/recent');

      // console.log(' [RECENT MESSAGES] Response:', response.data);

      

      let recentMessages = [];

      

      // Handle different response structures

      if (response.data && typeof response.data === 'object') {

        if (response.data.success && Array.isArray(response.data.data)) {

          recentMessages = response.data.data;

        } else if (Array.isArray(response.data)) {

          recentMessages = response.data;

        } else if (response.data.data && Array.isArray(response.data.data)) {

          recentMessages = response.data.data;

        }

      }

      

      const now = new Date();

      

      // Find messages from the last 30 seconds (simulating real-time)

      const newMessages = recentMessages.filter(message => {

        const messageTime = new Date(message.createdAt || message.date || message.timestamp);

        const timeDiff = (now - messageTime) / 1000; // seconds

        return timeDiff <= 30;

      });



      // Add new notifications

      newMessages.forEach(message => {

        const notificationExists = notifications.some(

          n => n.message?.id === message.id

        );

        

        if (!notificationExists) {

          const newNotification = {

            id: Date.now() + Math.random(),

            message,

            timestamp: new Date(),

            type: 'new_message',

          };

          

          setNotifications(prev => [newNotification, ...prev]);

          setUnreadCount(prev => prev + 1);

        }

      });

    } catch (error) {

      console.error('Error checking for new messages:', error);

      

      // If it's a 401 error, the user might not be authenticated

      if (error.status === 401) {

        console.warn(' [AUTH WARNING] User not authenticated for recent messages');

        // Don't process messages, just return

        return;

      }

    }

  }, [notifications]);



  // Remove notification

  const removeNotification = useCallback((notificationId) => {

    setNotifications(prev => prev.filter(n => n.id !== notificationId));

  }, []);



  // Clear all notifications

  const clearAllNotifications = useCallback(() => {

    setNotifications([]);

  }, []);



  // Mark message as read (decreases unread count)

  const markAsRead = useCallback((messageId) => {

    setUnreadCount(prev => Math.max(0, prev - 1));

    // Remove any notifications for this message

    setNotifications(prev => prev.filter(n => n.message?.id !== messageId));

  }, []);



  // Simulate WebSocket connection for real-time updates

  useEffect(() => {

    // Check if user is authenticated before starting polling

    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('authToken') || localStorage.getItem('adminToken'))
      : null;

    

    if (!token) {

      console.warn(' [AUTH WARNING] No authentication token found, skipping message polling');

      setIsConnected(false);

      return;

    }



    // Initial fetch

    fetchUnreadCount();

    

    // Set up polling for new messages (every 30 seconds)

    const interval = setInterval(() => {

      checkForNewMessages();

    }, 30000);



    // Simulate connection status

    setIsConnected(true);



    return () => {

      clearInterval(interval);

      setIsConnected(false);

    };

  }, [fetchUnreadCount, checkForNewMessages]);



  // Simulate receiving a new message (for testing)

  const simulateNewMessage = useCallback((message) => {

    const newNotification = {

      id: Date.now() + Math.random(),

      message,

      timestamp: new Date(),

      type: 'new_message',

    };

    

    setNotifications(prev => [newNotification, ...prev]);

    setUnreadCount(prev => prev + 1);

  }, []);



  return {

    notifications,

    unreadCount,

    isConnected,

    removeNotification,

    clearAllNotifications,

    markAsRead,

    simulateNewMessage,

    fetchUnreadCount,

  };

};



// Hook for managing message polling (can be used in other components)

export const useMessagePolling = (interval = 30000) => {

  const [lastCheck, setLastCheck] = useState(new Date());



  const checkForNewMessages = useCallback(async () => {

    try {

      const response = await api.get('/ContactMessages/recent');

      console.log(' [MESSAGE POLLING] Response:', response.data);

      

      let recentMessages = [];

      

      // Handle different response structures

      if (response.data && typeof response.data === 'object') {

        if (response.data.success && Array.isArray(response.data.data)) {

          recentMessages = response.data.data;

        } else if (Array.isArray(response.data)) {

          recentMessages = response.data;

        } else if (response.data.data && Array.isArray(response.data.data)) {

          recentMessages = response.data.data;

        }

      }

      

      const now = new Date();

      

      // Return messages from the last check

      const newMessages = recentMessages.filter(message => {

        const messageTime = new Date(message.createdAt || message.date || message.timestamp);

        return messageTime > lastCheck;

      });



      setLastCheck(now);

      return newMessages;

    } catch (error) {

      console.error('Error polling for messages:', error);

      // Don't throw error, just log it to avoid breaking the UI

    }

    return [];

  }, [lastCheck]);



  useEffect(() => {

    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('authToken') || localStorage.getItem('adminToken'))
      : null;

    if (!token) return;

    const intervalId = setInterval(checkForNewMessages, interval);

    return () => clearInterval(intervalId);

  }, [checkForNewMessages, interval]);



  return { checkForNewMessages };

};

