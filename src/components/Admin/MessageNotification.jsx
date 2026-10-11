'use client'
import React, { useState, useEffect } from "react";
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Reply as ReplyIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';

const MessageNotification = ({ notification, onClose, onReply, onView }) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleReply = () => {
    if (onReply) {
      onReply(notification.message);
    }
    handleClose();
  };

  const handleView = () => {
    if (onView) {
      onView(notification.message);
    } else {
      router.push("/admin/messages");
    }
    handleClose();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Box
            sx={{
              backgroundColor: 'var(--adm-surface, #1f2937)',
              border: '1px solid var(--adm-border, #374151)',
              borderRadius: '16px',
              boxShadow: 'var(--adm-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              backdropFilter: 'blur(16px)',
              minWidth: 400,
              maxWidth: 500,
            }}
          >
            {/* Header */}
            <Box className="p-4 border-b border-[var(--adm-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[var(--adm-accent)] rounded-lg">
                    <EmailIcon className="text-white text-lg" />
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="!font-semibold text-[var(--adm-text)]">
                      New Message Received
                    </Typography>
                    <Typography variant="body2" className="text-[var(--adm-text-subtle)]">
                      Just now
                    </Typography>
                  </div>
                </div>
                <IconButton
                  onClick={handleClose}
                  size="small"
                  className="!text-[var(--adm-text-subtle)] hover:!text-[var(--adm-text)]"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </Box>

            {/* Content */}
            <Box className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#3b82f6',
                    fontSize: '0.875rem',
                  }}
                >
                  {getInitials(notification.message?.fullName || notification.message?.name)}
                </Avatar>
                <div className="flex-1">
                  <Typography variant="subtitle1" className="!font-semibold text-[var(--adm-text)]">
                    {notification.message?.fullName || notification.message?.name || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" className="mb-2 text-[var(--adm-text-muted)]">
                    {notification.message?.email || 'No email provided'}
                  </Typography>
                  {notification.message?.subject && (
                    <Typography variant="body2" className="mb-1 font-medium text-[var(--adm-accent-text)]">
                      Subject: {notification.message.subject}
                    </Typography>
                  )}
                  <Typography 
                    variant="body2" 
                    className="line-clamp-2 text-[var(--adm-text)]"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {notification.message?.message || 'No message content'}
                  </Typography>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ReplyIcon />}
                    onClick={handleReply}
                    className="!normal-case"
                  >
                    Reply
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={handleView}
                    className="!normal-case"
                  >
                    Open message
                  </Button>
                </div>
                
              </div>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Notification Component for simpler notifications
export const MessageToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="fixed top-6 right-6 z-50"
        >
          <Snackbar
            open={isVisible}
            onClose={() => setIsVisible(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              '& .MuiSnackbarContent-root': {
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                color: 'white',
              },
            }}
          >
            <Alert
              severity="info"
              onClose={() => setIsVisible(false)}
              icon={<EmailIcon />}
              sx={{
                backgroundColor: '#1f2937',
                color: 'white',
                border: '1px solid #374151',
                '& .MuiAlert-icon': {
                  color: '#3b82f6',
                },
                '& .MuiAlert-message': {
                  color: 'white',
                },
              }}
            >
              <div>
                <Typography variant="body2" className="font-semibold">
                  New message from {notification.message?.name || 'someone'}
                </Typography>
                <Typography variant="caption" className="text-gray-300">
                  {notification.message?.subject || 'No subject'}
                </Typography>
              </div>
            </Alert>
          </Snackbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageNotification;
