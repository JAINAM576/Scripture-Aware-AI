import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, onSuggestionClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestions = [
    { text: "What does John 3:16 say?", icon: "📖" },
    { text: "What does the Bible say about anxiety?", icon: "🕊️" },
    { text: "Explain the Trinity simply", icon: "🙏" },
    { text: "What is the significance of Easter?", icon: "🌅" },
    { text: "Generate an image of the Good Shepherd", icon: "🖼️" },
  ];

  return (
    <div style={styles.window}>
      {messages.length === 0 && (
        <div style={styles.welcome}>
          {/* Logo / branding area */}
          <div style={styles.logoWrap}>
            <div style={styles.logo}>🕊️</div>
          </div>

          <h2 style={styles.welcomeTitle}>How can I help you today?</h2>
          <p style={styles.welcomeText}>
            Ask me anything about Christianity — scripture, theology,
            prayer, church history, or your faith journey.
          </p>

          <div style={styles.suggestions}>
            {suggestions.map((s) => (
              <button
                key={s.text}
                style={styles.suggestion}
                onClick={() => onSuggestionClick && onSuggestionClick(s.text)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e4eef9";
                  e.currentTarget.style.borderColor = "#2f6fb5";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(30,80,160,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#d8e6f3";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(30,80,160,0.06)";
                }}
              >
                <span style={styles.suggestionIcon}>{s.icon}</span>
                <span style={styles.suggestionText}>{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          role={msg.role}
          content={msg.content}
          routeUsed={msg.routeUsed}
          versesFetched={msg.versesFetched}
          imageUrl={msg.imageUrl}
          safePrompt={msg.safePrompt}
          timestamp={msg.timestamp}
        />
      ))}

      {/* Typing indicator */}
      {loading && (
        <div style={styles.typingWrap}>
          <div style={styles.typingAvatar}>🕊️</div>
          <div style={styles.typingBubble}>
            <div style={styles.typingDots}>
              <span style={{ ...styles.dot, animationDelay: "0s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  window: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 20px 8px",
    display: "flex",
    flexDirection: "column",
  },

  /* ── Welcome state ── */
  welcome: {
    textAlign: "center",
    padding: "32px 20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  logoWrap: {
    marginBottom: "8px",
  },
  logo: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #2f6fb5 0%, #1a4a82 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "600",
    boxShadow: "0 4px 20px rgba(30,80,160,0.2)",
  },
  welcomeTitle: {
    fontFamily: "'Lora', serif",
    fontSize: "22px",
    color: "#1a4a82",
    fontWeight: "600",
    margin: 0,
  },
  welcomeText: {
    fontSize: "15px",
    color: "#5a7080",
    lineHeight: "1.7",
    maxWidth: "420px",
    margin: "0 0 8px 0",
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    maxWidth: "540px",
  },
  suggestion: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#ffffff",
    color: "#2f6fb5",
    border: "1px solid #d8e6f3",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 1px 4px rgba(30,80,160,0.06)",
    textAlign: "left",
  },
  suggestionIcon: {
    fontSize: "16px",
    flexShrink: 0,
  },
  suggestionText: {
    fontWeight: "500",
  },

  /* ── Typing indicator ── */
  typingWrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    marginBottom: "18px",
  },
  typingAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2f6fb5 0%, #1a4a82 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(30,80,160,0.15)",
  },
  typingBubble: {
    background: "#ffffff",
    border: "1px solid #e0eaf5",
    borderRadius: "18px 18px 18px 4px",
    padding: "14px 20px",
    boxShadow: "0 2px 10px rgba(30,80,160,0.07)",
  },
  typingDots: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
  },
  dot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#a8c8ee",
    animation: "bounce 0.8s infinite",
  },
};
