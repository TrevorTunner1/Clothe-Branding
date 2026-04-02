import React, { useState, useEffect } from 'react';
import styles from './ChatRoom.module.css';

const designers = [
  { id: 1, name: "Brutige Admin", role: "Support", status: "Online", avatar: "A" },
  { id: 2, name: "Julian Voss", role: "Lead Designer", status: "Online", avatar: "JV" },
  { id: 3, name: "Elena Rossi", role: "Pattern Maker", status: "Away", avatar: "ER" },
  { id: 4, name: "Marcus Chen", role: "Tailoring", status: "Online", avatar: "MC" }
];

const ChatRoom = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Auto-select first designer on laptop, keep null on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !selectedId) setSelectedId(1);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedId]);

  const activeDesigner = designers.find(d => d.id === selectedId);

  return (
    <div className={styles.container}>
      {/* 1. DESIGNER LIST (Always visible on Laptop, hidden on Mobile when chat is open) */}
      <div className={`${styles.sidebar} ${isMobile && selectedId ? styles.hideSidebar : ''}`}>
        <div className={styles.listHeader}>
          <h3>Studio Messages</h3>
          <p>{designers.length} Professionals Online</p>
        </div>
        <div className={styles.list}>
          {designers.map(d => (
            <button 
              key={d.id} 
              className={`${styles.designerCard} ${selectedId === d.id ? styles.activeCard : ''}`}
              onClick={() => setSelectedId(d.id)}
            >
              <div className={styles.avatar}>{d.avatar}</div>
              <div className={styles.info}>
                <h4>{d.name}</h4>
                <span>{d.role}</span>
              </div>
              {d.status === "Online" && <div className={styles.onlineBadge} />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CHAT AREA (Always visible on Laptop, Slides in on Mobile) */}
      <div className={`${styles.chatArea} ${isMobile && selectedId ? styles.showChat : ''}`}>
        {activeDesigner ? (
          <div className={styles.chatWrapper}>
            <header className={styles.chatHeader}>
              {isMobile && (
                <button className={styles.backBtn} onClick={() => setSelectedId(null)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
              )}
              <div className={styles.headerInfo}>
                <div className={styles.miniAvatar}>{activeDesigner.avatar}</div>
                <div>
                  <h4>{activeDesigner.name}</h4>
                  <span>{activeDesigner.status} • {activeDesigner.role}</span>
                </div>
              </div>
            </header>

            <div className={styles.messageHistory}>
              <div className={styles.received}>
                Hello! How can we help brand your vision today?
              </div>
              <div className={styles.sent}>
                I'm looking for the technical specs on the 450GSM hoodies.
              </div>
              <div className={styles.received}>
                Absolutely. I've sent the tech-pack to your profile dashboard.
              </div>
            </div>

            <div className={styles.inputSection}>
              <button className={styles.attachBtn}>+</button>
              <input type="text" placeholder={`Message ${activeDesigner.name}...`} />
              <button className={styles.sendBtn}>Send</button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
            </svg>
            <p>Select a designer to start branding</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;