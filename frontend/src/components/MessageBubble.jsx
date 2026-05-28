import { useState, useRef } from "react";

/**
 * Format a timestamp into a short human-readable time string.
 * e.g. "10:34 PM"
 */
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Route label mapping — user-facing names instead of raw enum values.
 */
const ROUTE_LABELS = {
  EXACT_VERSE: "Scripture Lookup",
  THEMATIC: "Thematic Search",
  DOCTRINAL: "Doctrinal Guidance",
  IMAGE: "Image Generation",
  ADVERSARIAL: "Safety Filtered",
  BLOCKED: "Blocked",
  ERROR: "Error",
};

export default function MessageBubble({
  role,
  content,
  routeUsed,
  versesFetched,
  imageUrl,
  safePrompt,
  timestamp,
}) {
  const isUser = role === "user";
  const hasImage = !!imageUrl;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const imgRef = useRef(null);

  function handleImageLoad() {
    setImgLoaded(true);
    setImgError(false);
    retryCount.current = 0;
  }

  function handleImageError() {
    if (retryCount.current < maxRetries) {
      retryCount.current += 1;
      const delay = retryCount.current * 2000;
      setTimeout(() => {
        if (imgRef.current) {
          const separator = imageUrl.includes("?") ? "&" : "?";
          imgRef.current.src = `${imageUrl}${separator}seed=${Date.now()}`;
        }
      }, delay);
    } else {
      setImgError(true);
    }
  }

  const routeLabel = ROUTE_LABELS[routeUsed] || routeUsed;
  const showRoute =
    routeUsed && routeUsed !== "BLOCKED" && routeUsed !== "ERROR" && !isUser;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "18px",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {/* AI avatar — only for assistant */}
      {!isUser && (
        <div style={styles.avatar}>🕊️</div>
      )}

      <div style={{ maxWidth: hasImage ? "80%" : "72%", position: "relative" }}>
        {/* Bubble */}
        <div
          style={{
            background: isUser
              ? "linear-gradient(135deg, #2f6fb5 0%, #1a5a9e 100%)"
              : "#ffffff",
            color: isUser ? "#ffffff" : "#1a2a3a",
            borderRadius: isUser
              ? "18px 18px 4px 18px"
              : "18px 18px 18px 4px",
            padding: "14px 18px",
            fontSize: "15px",
            lineHeight: "1.7",
            boxShadow: isUser
              ? "0 3px 14px rgba(30,80,160,0.18)"
              : "0 2px 10px rgba(30,80,160,0.07)",
            border: isUser ? "none" : "1px solid #e0eaf5",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {/* Message text */}
          <div>{content}</div>

          {/* ── Inline image rendering ── */}
          {hasImage && (
            <div style={styles.imageContainer}>
              {!imgLoaded && !imgError && (
                <div style={styles.skeleton}>
                  <div style={styles.skeletonIcon}>🖼️</div>
                  <div style={styles.skeletonBarContainer}>
                    <div style={styles.skeletonBar} />
                    <div
                      style={{
                        ...styles.skeletonBar,
                        width: "60%",
                        animationDelay: "0.3s",
                      }}
                    />
                  </div>
                  <p style={styles.skeletonText}>Generating image…</p>
                </div>
              )}

              {imgError && (
                <div style={styles.errorBox}>
                  <span style={{ fontSize: "24px" }}>⚠️</span>
                  <p style={styles.errorText}>
                    Image failed to load. The prompt may have been too complex.
                  </p>
                </div>
              )}

              {!imgError && (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt={safePrompt || "Generated Christian image"}
                  referrerPolicy="no-referrer"
                  style={{
                    ...styles.image,
                    display: imgLoaded ? "block" : "none",
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}

              {safePrompt && imgLoaded && (
                <p style={styles.promptLabel}>
                  <span style={styles.promptIcon}>🎨</span>{" "}
                  <em>{safePrompt}</em>
                </p>
              )}
            </div>
          )}

          {/* ── Scripture citations — polished card style ── */}
          {versesFetched && versesFetched.length > 0 && (
            <div style={styles.citationBlock}>
              <div style={styles.citationHeader}>
                <span style={styles.citationIcon}>📖</span>
                <span style={styles.citationLabel}>Verified Scripture</span>
              </div>
              <div style={styles.citationList}>
                {versesFetched.map((verse, idx) => (
                  <span key={idx} style={styles.citationPill}>
                    {verse}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer: timestamp + route tag ── */}
        <div
          style={{
            display: "flex",
            justifyContent: isUser ? "flex-end" : "flex-start",
            alignItems: "center",
            gap: "8px",
            marginTop: "5px",
            paddingLeft: isUser ? 0 : "4px",
            paddingRight: isUser ? "4px" : 0,
          }}
        >
          {/* Timestamp */}
          <span style={styles.timestamp}>{formatTime(timestamp)}</span>

          {/* Route badge */}
          {showRoute && (
            <span style={styles.routeBadge}>{routeLabel}</span>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={styles.userAvatar}>You</div>
      )}
    </div>
  );
}

const styles = {
  avatar: {
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
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#e8f0fa",
    color: "#2f6fb5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "600",
    flexShrink: 0,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.3px",
  },
  timestamp: {
    fontSize: "11px",
    color: "#a0b4c8",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.2px",
    whiteSpace: "nowrap",
  },
  routeBadge: {
    fontSize: "10px",
    color: "#2f6fb5",
    background: "#eaf2fc",
    border: "1px solid #d0e2f4",
    borderRadius: "10px",
    padding: "2px 8px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "500",
    letterSpacing: "0.2px",
    whiteSpace: "nowrap",
  },

  /* ── Citation styles ── */
  citationBlock: {
    marginTop: "14px",
    padding: "10px 14px",
    background: "linear-gradient(135deg, #f6f9fe 0%, #eef4fb 100%)",
    borderRadius: "10px",
    border: "1px solid #d8e6f3",
  },
  citationHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  citationIcon: {
    fontSize: "14px",
  },
  citationLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#1a4a82",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    fontFamily: "'Inter', sans-serif",
  },
  citationList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  citationPill: {
    fontSize: "12px",
    color: "#2f6fb5",
    background: "#ffffff",
    border: "1px solid #ccdaec",
    borderRadius: "14px",
    padding: "3px 10px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "500",
  },

  /* ── Image styles ── */
  imageContainer: {
    marginTop: "12px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  skeleton: {
    background: "linear-gradient(135deg, #f0f4fa 0%, #e4ecf7 100%)",
    borderRadius: "10px",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    border: "1px solid #ddeaf8",
    minHeight: "200px",
    justifyContent: "center",
  },
  skeletonIcon: {
    fontSize: "36px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonBarContainer: {
    width: "100%",
    maxWidth: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  skeletonBar: {
    height: "8px",
    width: "80%",
    borderRadius: "4px",
    background:
      "linear-gradient(90deg, #ddeaf8 25%, #c8daf0 50%, #ddeaf8 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
  },
  skeletonText: {
    fontSize: "13px",
    color: "#5a7080",
    margin: 0,
    fontStyle: "italic",
  },
  errorBox: {
    background: "#fdf2f2",
    borderRadius: "10px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #f5c6c6",
  },
  errorText: {
    fontSize: "13px",
    color: "#9b2c2c",
    margin: 0,
    textAlign: "center",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #ddeaf8",
  },
  promptLabel: {
    fontSize: "11px",
    color: "#5a7080",
    marginTop: "10px",
    lineHeight: "1.5",
    padding: "6px 10px",
    background: "#f9fbfd",
    borderRadius: "6px",
    border: "1px solid #e8f0fa",
  },
  promptIcon: {
    fontSize: "12px",
  },
};
