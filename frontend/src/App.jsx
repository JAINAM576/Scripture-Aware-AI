import { useState, useRef, useCallback } from "react";
import DenominationPicker from "./components/DenominationPicker";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import ImagePanel from "./components/ImagePanel";
import { sendMessage } from "./api/chat";

/**
 * Generate a stable session ID for a denomination.
 * Each denomination gets its own unique ID on first use,
 * and reuses it when the user switches back.
 */
function generateSessionId(denomination) {
  return `${denomination.toLowerCase()}-${Math.random().toString(36).slice(2)}`;
}

export default function App() {
  const [denomination, setDenomination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);

  // Per-denomination session IDs: { Protestant: "protestant-abc123", Catholic: "catholic-xyz789", ... }
  const sessionIdsRef = useRef({});

  // Per-denomination message histories: { Protestant: [...messages], Catholic: [...messages], ... }
  const [messagesByDenom, setMessagesByDenom] = useState({});

  /** Get or create a stable session ID for the given denomination */
  function getSessionId(denom) {
    if (!sessionIdsRef.current[denom]) {
      sessionIdsRef.current[denom] = generateSessionId(denom);
    }
    return sessionIdsRef.current[denom];
  }

  /** Get current denomination's messages */
  const currentMessages = denomination ? (messagesByDenom[denomination] || []) : [];

  /** Append a message to a specific denomination's history */
  const appendMessage = useCallback((denom, msg) => {
    setMessagesByDenom(prev => ({
      ...prev,
      [denom]: [...(prev[denom] || []), msg]
    }));
  }, []);

  // Step 1 — show denomination picker before chat starts
  if (!denomination) {
    return <DenominationPicker onSelect={setDenomination} />;
  }

  async function handleSend(text) {
    const currentDenom = denomination;
    const sessionId = getSessionId(currentDenom);

    // Add user message to this denomination's history immediately
    appendMessage(currentDenom, { role: "user", content: text, timestamp: Date.now() });
    setLoading(true);

    try {
      const data = await sendMessage({
        sessionId,
        message: text,
        denomination: currentDenom
      });

      appendMessage(currentDenom, {
        role: "assistant",
        content: data.reply,
        routeUsed: data.route_used,
        versesFetched: data.verses_fetched,
        imageUrl: data.image_url || "",
        safePrompt: data.safe_prompt || "",
        timestamp: Date.now()
      });
    } catch {
      appendMessage(currentDenom, {
        role: "assistant",
        content: "Something went wrong. Please try again.",
        routeUsed: "ERROR",
        timestamp: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>🕊️</div>
          <div>
            <h1 style={styles.title}>Christian AI Assistant</h1>
            <p style={styles.denomination}>{denomination} tradition</p>
          </div>
        </div>
        <button
          id="switch-tradition-btn"
          style={styles.switchBtn}
          onClick={() => setDenomination(null)}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#eaf2fc";
            e.currentTarget.style.borderColor = "#2f6fb5";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#ccdaec";
          }}
        >
          ↻ Switch tradition
        </button>
      </div>

      {/* Chat area */}
      <ChatWindow
        messages={currentMessages}
        loading={loading}
        onSuggestionClick={handleSend}
      />

      {/* Input bar */}
      <InputBar
        onSend={handleSend}
        onImageMode={() => setShowImagePanel(true)}
        disabled={loading}
      />

      {/* Image panel modal */}
      {showImagePanel && (
        <ImagePanel onClose={() => setShowImagePanel(false)} />
      )}
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    background: "#ffffff"
  },
  header: {
    padding: "14px 24px",
    borderBottom: "1px solid #e0eaf5",
    background: "linear-gradient(180deg, #ffffff 0%, #f9fbfe 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  headerIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2f6fb5 0%, #1a4a82 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 2px 8px rgba(30,80,160,0.18)"
  },
  title: {
    fontFamily: "'Lora', serif",
    fontSize: "18px",
    color: "#1a4a82",
    lineHeight: "1.2"
  },
  denomination: {
    fontSize: "12px",
    color: "#5a7080",
    marginTop: "1px",
    fontFamily: "'Inter', sans-serif"
  },
  switchBtn: {
    background: "transparent",
    border: "1px solid #ccdaec",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "13px",
    color: "#2f6fb5",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
    fontWeight: "500"
  }
};
