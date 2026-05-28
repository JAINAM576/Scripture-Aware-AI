import { useState } from "react";

export default function InputBar({ onSend, onImageMode, disabled }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSend() {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = !disabled && text.trim();

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.inputWrap,
          borderColor: focused ? "#2f6fb5" : "#ccdaec",
          boxShadow: focused
            ? "0 0 0 3px rgba(47,111,181,0.08)"
            : "0 1px 4px rgba(30,80,160,0.04)",
        }}
      >
        <textarea
          id="chat-input"
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask about scripture, theology, Christian life…"
          rows={1}
          disabled={disabled}
        />
        <div style={styles.actions}>
          <button
            id="image-mode-btn"
            style={styles.imageBtn}
            onClick={onImageMode}
            title="Generate Christian image"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eaf2fc";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🖼️
          </button>
          <button
            id="send-btn"
            style={{
              ...styles.sendBtn,
              opacity: canSend ? 1 : 0.4,
              transform: canSend ? "scale(1)" : "scale(0.95)",
            }}
            onClick={handleSend}
            disabled={!canSend}
            onMouseEnter={(e) => {
              if (canSend) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #1a5a9e 0%, #143d6b 100%)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #2f6fb5 0%, #1a4a82 100%)";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <p style={styles.disclaimer}>
        Responses are AI-generated. Always verify scripture with your Bible.
      </p>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "12px 20px 10px",
    background: "linear-gradient(180deg, #f9fbfe 0%, #ffffff 100%)",
    borderTop: "1px solid #e0eaf5",
  },
  inputWrap: {
    display: "flex",
    alignItems: "flex-end",
    border: "1.5px solid #ccdaec",
    borderRadius: "14px",
    background: "#ffffff",
    padding: "4px 6px 4px 16px",
    transition: "all 0.2s ease",
  },
  input: {
    flex: 1,
    padding: "10px 0",
    border: "none",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    resize: "none",
    outline: "none",
    background: "transparent",
    color: "#1a2a3a",
    lineHeight: "1.5",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    paddingBottom: "4px",
  },
  imageBtn: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.2s ease",
  },
  sendBtn: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2f6fb5 0%, #1a4a82 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(30,80,160,0.2)",
  },
  disclaimer: {
    fontSize: "11px",
    color: "#a0b4c8",
    textAlign: "center",
    marginTop: "8px",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.1px",
  },
};
