import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ChatRoom.module.css';
import { chatAPI, useChatWebSocket } from './ChartService.js'; // Mock API and WebSocket hook

// DTO Structure matching your Java Backend
// Matches: public record ConversationDTO(Long id, String name, String role, String status, String avatar, String lastMessage, LocalDateTime timestamp)
const ChatRoom = ({ currentUserId = 1, authToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState({ conversations: true, messages: false });
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState({});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // WebSocket connection for real-time messages
  const { sendMessage, isConnected } = useChatWebSocket(
    authToken,
    (newMessage) => {
      // Handle incoming message from Java WebSocket (STOMP)
      setMessages(prev => {
        const conversationId = newMessage.conversationId;
        const existing = prev[conversationId] || [];
        return {
          ...prev,
          [conversationId]: [...existing, newMessage]
        };
      });
      
      // Update last message in conversation list
      setConversations(prev => prev.map(c => 
        c.id === newMessage.conversationId 
          ? { ...c, lastMessage: newMessage.content, timestamp: new Date() }
          : c
      ));
    }
  );

  // Initial load - Fetch conversations from Java Backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(prev => ({ ...prev, conversations: true }));
        // Replace with actual endpoint: GET /api/chat/conversations
        const data = await chatAPI.getConversations(authToken);
        setConversations(data);
        
        // Auto-select first on desktop
        if (!isMobile && data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        setError('Failed to load conversations');
        console.error('Java Backend Error:', err);
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    fetchConversations();
  }, [authToken, isMobile]);

  // Load messages when conversation selected
  useEffect(() => {
    if (!selectedId) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(prev => ({ ...prev, messages: true }));
        // Replace with: GET /api/chat/messages/{conversationId}?page=0&size=50
        const data = await chatAPI.getMessages(selectedId, 0, authToken);
        setMessages(prev => ({ ...prev, [selectedId]: data.content }));
        setHasMore(prev => ({ ...prev, [selectedId]: !data.last }));
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    if (!messages[selectedId]) {
      fetchMessages();
    }
  }, [selectedId, authToken]);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !selectedId && conversations.length > 0) {
        setSelectedId(conversations[0].id);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedId, conversations]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedId]]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedId) return;
    
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      content: inputText,
      sent: true,
      timestamp: new Date().toISOString(),
      conversationId: selectedId,
      status: 'SENDING'
    };
    
    // Optimistic update
    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage]
    }));
    setInputText("");
    
    try {
      // Java Backend: POST /api/chat/messages
      const savedMessage = await chatAPI.sendMessage({
        conversationId: selectedId,
        content: inputText,
        senderId: currentUserId
      }, authToken);
      
      // Replace temp message with server response (has real ID)
      setMessages(prev => ({
        ...prev,
        [selectedId]: prev[selectedId].map(m => 
          m.id === tempId ? { ...savedMessage, status: 'SENT' } : m
        )
      }));
      
      // Also send via WebSocket for real-time delivery
      if (isConnected) {
        sendMessage(savedMessage);
      }
      
    } catch (err) {
      // Mark as failed for retry
      setMessages(prev => ({
        ...prev,
        [selectedId]: prev[selectedId].map(m => 
          m.id === tempId ? { ...m, status: 'FAILED' } : m
        )
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedId) return;
    
    try {
      // Java Backend: POST /api/chat/upload (MultipartFile)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', selectedId);
      
      const response = await chatAPI.uploadFile(formData, authToken);
      // Handle file message...
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const activeConversation = conversations.find(c => c.id === selectedId);
  const currentMessages = messages[selectedId] || [];

  if (error) return (
    <div className={styles.errorState}>
      <h3>Connection Error</h3>
      <p>Could not connect to Java Backend</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${isMobile && selectedId ? styles.hidden : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Studio Chat</h2>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Search makers..." 
              onChange={(e) => {
                // Debounce search to Java Backend
                // GET /api/chat/conversations/search?query=
              }}
            />
          </div>
        </div>
        
        <div className={styles.contactList}>
          {loading.conversations ? (
            <div className={styles.skeletonList}>
              {[1,2,3].map(i => <div key={i} className={styles.skeletonCard} />)}
            </div>
          ) : (
            conversations.map(conv => {
              const isActive = selectedId === conv.id;
              const isOnline = conv.status === 'ONLINE';
              
              return (
                <button 
                  key={conv.id} 
                  className={`${styles.contactCard} ${isActive ? styles.active : ''}`}
                  onClick={() => setSelectedId(conv.id)}
                >
                  <div className={styles.avatar}>
                    <span>{conv.avatar || conv.name?.substring(0,2).toUpperCase()}</span>
                    {isOnline && <div className={styles.onlineIndicator} />}
                  </div>
                  
                  <div className={styles.contactInfo}>
                    <div className={styles.contactHeader}>
                      <h4>{conv.name}</h4>
                      <span className={styles.timestamp}>
                        {conv.timestamp && new Date(conv.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className={styles.contactMeta}>
                      <p className={styles.role}>{conv.role}</p>
                      <p className={styles.lastMessage}>
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className={`${styles.chatArea} ${isMobile && selectedId ? styles.visible : ''}`}>
        {activeConversation ? (
          <>
            <header className={styles.chatHeader}>
              <div className={styles.headerLeft}>
                {isMobile && (
                  <button className={styles.backBtn} onClick={() => setSelectedId(null)}>
                    ←
                  </button>
                )}
                <div className={styles.headerAvatar}>
                  {activeConversation.avatar || activeConversation.name?.substring(0,2).toUpperCase()}
                </div>
                <div className={styles.headerInfo}>
                  <h3>{activeConversation.name}</h3>
                  <span className={styles.statusText}>
                    {activeConversation.status} • {activeConversation.role}
                  </span>
                </div>
              </div>
              
              <div className={styles.headerActions}>
                <button className={styles.iconBtn} title="More options">⋯</button>
              </div>
            </header>

            <div className={styles.messagesContainer}>
              {loading.messages && currentMessages.length === 0 ? (
                <div className={styles.loadingMessages}>Loading...</div>
              ) : (
                <>
                  <div className={styles.dateDivider}>
                    <span>Today</span>
                  </div>
                  
                  {currentMessages.map((msg, idx) => {
                    const isSent = msg.senderId === currentUserId;
                    const showStatus = isSent && idx === currentMessages.length - 1;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`${styles.messageRow} ${isSent ? styles.sent : styles.received}`}
                      >
                        <div className={styles.message}>
                          <p>{msg.content}</p>
                          <div className={styles.messageMeta}>
                            <span className={styles.messageTime}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            {showStatus && (
                              <span className={`${styles.status} ${styles[msg.status?.toLowerCase()]}`}>
                                {msg.status === 'SENDING' ? '⋯' : 
                                 msg.status === 'FAILED' ? '✕' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form className={styles.inputContainer} onSubmit={handleSend}>
              <input 
                type="file" 
                ref={fileInputRef}
                className={styles.fileInput}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
              
              <button 
                type="button" 
                className={styles.attachBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation.name}...`}
                className={styles.messageInput}
              />
              
              <button 
                type="submit" 
                className={`${styles.sendBtn} ${inputText.trim() ? styles.active : ''}`}
                disabled={!inputText.trim()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
              </svg>
            </div>
            <h3>Brutige Studio</h3>
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatRoom;