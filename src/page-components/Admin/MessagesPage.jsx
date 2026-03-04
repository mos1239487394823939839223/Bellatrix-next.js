'use client'
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/UI/Card";
import Modal, { ModalFooter } from "../../components/UI/Modal";
import Toast from "../../components/UI/Toast";
import MessagesList from "../../components/Admin/MessagesList";
import { 
  getContactMessages, 
  markMessageAsReplied, 
  markMessageAsUnreplied, 
  deleteContactMessage
} from "../../lib/contactMessagesAPI";

const MessagesPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");

  const ITEMS_PER_PAGE = 10;

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getContactMessages();
      
      if (response.success) {
        setMessages(response.data || []);
        setFilteredMessages(response.data || []);
      } else {
        setError(response.message || "Failed to fetch messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to fetch messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterMessages = useCallback(() => {
    let filtered = messages;

    if (filterStatus === "unread") {
      filtered = filtered.filter(msg => !msg.isReplied);
    } else if (filterStatus === "read") {
      filtered = filtered.filter(msg => msg.isReplied);
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.fullName?.toLowerCase().includes(query) ||
        msg.name?.toLowerCase().includes(query) ||
        msg.email?.toLowerCase().includes(query) ||
        msg.subject?.toLowerCase().includes(query) ||
        msg.message?.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  }, [messages, filterStatus, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Reply modal removed; Reply button now toggles read/unread via onMarkStatus

  const handleMarkStatus = async (messageId, isReplied) => {
    try {
      setOperationLoading(true);
      const response = isReplied 
        ? await markMessageAsUnreplied(messageId)
        : await markMessageAsReplied(messageId);
      
      if (response.success) {
        showToast(
          isReplied ? "Message marked as unread" : "Message marked as read",
          "success"
        );
        fetchMessages();
      } else {
        showToast(response.message || "Failed to update message status", "error");
      }
    } catch (err) {
      console.error("Error updating message status:", err);
      showToast("Failed to update message status", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = (messageId) => {
    setSelectedMessage({ id: messageId });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedMessage?.id) return;

    try {
      setOperationLoading(true);
      const response = await deleteContactMessage(selectedMessage.id);
      
      if (response.success) {
        showToast("Message deleted successfully", "success");
        fetchMessages();
        setShowDeleteModal(false);
        setSelectedMessage(null);
      } else {
        showToast(response.message || "Failed to delete message", "error");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      showToast("Failed to delete message", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  // No reply submit; using mark as replied instead

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    filterMessages();
  }, [filterMessages]);

  const stats = {
    total: messages.length,
    unread: messages.filter(msg => !msg.isReplied).length,
    read: messages.filter(msg => msg.isReplied).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages Management</h2>
          <p className="text-gray-300">Manage contact form messages and replies</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            icon={<ArrowPathIcon className="h-4 w-4" />}
            onClick={fetchMessages}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border border-white/20 shadow transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white/90" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Messages</p>
                <p className="text-2xl font-bold text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border border-white/20 shadow transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Unread</p>
                <p className="text-2xl font-bold text-white">
                  {stats.unread}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border border-white/20 shadow transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Read</p>
                <p className="text-2xl font-bold text-white">
                  {stats.read}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 border border-white/20 shadow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={handleSearchChange}
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                All
              </Button>
              <Button
                onClick={() => handleFilterChange("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterStatus === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Unread
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-500/10 border border-red-500/20 shadow">
          <CardContent className="p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <MessagesList
        messages={filteredMessages}
        onMarkStatus={handleMarkStatus}
        onDelete={handleDelete}
      />

      {/* ReplyModal removed */}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Message"
      >
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
        </div>
        <ModalFooter>
          <Button
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={operationLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {operationLoading ? "Deleting..." : "Delete"}
          </Button>
        </ModalFooter>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MessagesPage;
