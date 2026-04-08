// MOCK IMPLEMENTATION - Replace with real API calls when Java backend is ready
const MOCK_DELAY = 300; // Simulate network latency

// Fake data store
const mockConversations = [
  { id: 1, name: "Brutige Admin", role: "Support", status: "ONLINE", avatar: "BA", lastMessage: "Your order has shipped", timestamp: new Date().toISOString() },
  { id: 2, name: "Julian Voss", role: "Lead Designer", status: "ONLINE", avatar: "JV", lastMessage: "Samples are ready for review", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, name: "Elena Rossi", role: "Pattern Maker", status: "AWAY", avatar: "ER", lastMessage: "Pattern adjustments complete", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, name: "Marcus Chen", role: "Tailoring", status: "OFFLINE", avatar: "MC", lastMessage: "Measurements confirmed", timestamp: new Date(Date.now() - 172800000).toISOString() }
];

const mockMessages = {
  1: [
    { id: 101, content: "Welcome to Brutige Studio!", sent: false, timestamp: new Date(Date.now() - 3600000).toISOString(), senderId: 99, status: 'SENT' },
    { id: 102, content: "Hi, I need to check my order status", sent: true, timestamp: new Date(Date.now() - 3000000).toISOString(), senderId: 1, status: 'SENT' },
    { id: 103, content: "Your order #2394 has shipped via DHL", sent: false, timestamp: new Date(Date.now() - 2400000).toISOString(), senderId: 99, status: 'SENT' }
  ],
  2: [
    { id: 201, content: "The new heavyweight tees are in production", sent: false, timestamp: new Date(Date.now() - 7200000).toISOString(), senderId: 2, status: 'SENT' }
  ]
};

// Mock API Service
export const chatAPI = {
  getConversations: async (token) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    console.log('[MOCK] GET /api/chat/conversations');
    return [...mockConversations];
  },

  getMessages: async (conversationId, page = 0, token) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    console.log(`[MOCK] GET /api/chat/messages/${conversationId}?page=${page}`);
    return {
      content: mockMessages[conversationId] || [],
      last: true, // No more pages
      number: page,
      totalElements: (mockMessages[conversationId] || []).length
    };
  },

  sendMessage: async (payload, token) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    console.log('[MOCK] POST /api/chat/messages', payload);
    
    const newMsg = {
      id: Date.now(),
      content: payload.content,
      sent: true,
      timestamp: new Date().toISOString(),
      senderId: payload.senderId,
      status: 'SENT',
      conversationId: payload.conversationId
    };
    
    // Add to mock store so it persists during session
    if (!mockMessages[payload.conversationId]) {
      mockMessages[payload.conversationId] = [];
    }
    mockMessages[payload.conversationId].push(newMsg);
    
    return newMsg;
  },

  uploadFile: async (formData, token) => {
    await new Promise(r => setTimeout(r, 1000));
    console.log('[MOCK] POST /api/chat/upload');
    return { fileUrl: 'https://placeholder.com/file.pdf', fileName: 'document.pdf' };
  }
};

// Mock WebSocket Hook
export const useChatWebSocket = (token, onMessage) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true);
      console.log('[MOCK] WebSocket connected');
    }, 500);

    // Simulate receiving a message after 10 seconds (for testing)
    const testMsg = setTimeout(() => {
      onMessage({
        id: 999,
        content: "This is a simulated incoming message!",
        sent: false,
        timestamp: new Date().toISOString(),
        senderId: 2,
        conversationId: 1
      });
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(testMsg);
      console.log('[MOCK] WebSocket disconnected');
    };
  }, [token, onMessage]);

  const sendMessage = useCallback((message) => {
    console.log('[MOCK] WS send:', message);
  }, []);

  return { sendMessage, isConnected };
};

// TEMPORARY: Add useState import for the mock hook
import { useState, useEffect, useCallback } from 'react';