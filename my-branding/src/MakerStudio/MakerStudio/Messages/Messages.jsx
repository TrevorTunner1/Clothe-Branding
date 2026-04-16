import React, { useState } from 'react';
import styles from './Messages.module.css';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  
  const chats = [
    { id: 1, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', lastMessage: 'When will my order arrive?', time: '2m ago', unread: 2 },
    { id: 2, name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', lastMessage: 'Thanks for the quick response!', time: '1h ago', unread: 0 },
    { id: 3, name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', lastMessage: 'Do you have this in XL?', time: '3h ago', unread: 1 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.chatList}>
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" placeholder="Search messages..." />
        </div>
        
        <div className={styles.chats}>
          {chats.map(chat => (
            <button 
              key={chat.id}
              className={`${styles.chatItem} ${selectedChat === chat.id ? styles.active : ''}`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <img src={chat.avatar} alt={chat.name} className={styles.avatar} />
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.name}>{chat.name}</span>
                  <span className={styles.time}>{chat.time}</span>
                </div>
                <div className={styles.chatPreview}>
                  <span className={styles.message}>{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span className={styles.badge}>{chat.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.chatWindow}>
        {selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <img 
                src={chats.find(c => c.id === selectedChat)?.avatar} 
                alt="" 
                className={styles.avatar} 
              />
              <span className={styles.name}>
                {chats.find(c => c.id === selectedChat)?.name}
              </span>
            </div>
            <div className={styles.messages}>
              <div className={`${styles.message} ${styles.received}`}>
                <p>Hi! I have a question about my order.</p>
                <span className={styles.time}>10:30 AM</span>
              </div>
              <div className={`${styles.message} ${styles.sent}`}>
                <p>Hello! Sure, I'd be happy to help. What's your order number?</p>
                <span className={styles.time}>10:32 AM</span>
              </div>
              <div className={`${styles.message} ${styles.received}`}>
                <p>It's #ORD-001. When will it arrive?</p>
                <span className={styles.time}>10:33 AM</span>
              </div>
            </div>
            <div className={styles.inputArea}>
              <input type="text" placeholder="Type a message..." />
              <button className={styles.sendBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
            </svg>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;