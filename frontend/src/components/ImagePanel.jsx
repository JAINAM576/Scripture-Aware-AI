import { useState, useRef } from "react";
import { generateImage } from "../api/image";

export default function ImagePanel({ onClose }) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const retryCount = useRef(0);
  const maxRetries = 3;
  const imgRef = useRef(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setImageLoading(false);
    retryCount.current = 0;
    try {
      const data = await generateImage(prompt);
      console.log(data, "data");
      if (data.blocked) {
        setError("This image request was flagged. Please try a different description.");
      } else {
        setResult(data);
        setImageLoading(true);
      }
    } catch {
      setError("Image generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageLoad() {
    // Image loaded successfully
    setImageLoading(false);
    retryCount.current = 0;
  }

  function handleImageError() {
    // Pollinations.ai generates images on-the-fly, so the first request
    // may fail while the server is still rendering. Retry with a cache-busting
    // seed parameter after a short delay.
    if (retryCount.current < maxRetries && result) {
      retryCount.current += 1;
      const delay = retryCount.current * 2000; // 2s, 4s, 6s
      setTimeout(() => {
        if (imgRef.current && result) {
          // Add a cache-busting seed to force a fresh request
          const separator = result.image_url.includes("?") ? "&" : "?";
          imgRef.current.src = `${result.image_url}${separator}seed=${Date.now()}`;
        }
      }, delay);
    } else {
      // All retries exhausted
      setImageLoading(false);
      setError("Image failed to load after multiple attempts. Try a different prompt.");
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Generate Christian Image</h2>
          <button
            id="close-image-panel"
            style={styles.close}
            onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.color = "#1a2a3a"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#5a7080"; }}
          >
            ✕
          </button>
        </div>

        <textarea
          id="image-prompt-input"
          style={styles.input}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. The Sermon on the Mount, The Good Shepherd, Nativity scene..."
          rows={3}
        />

        <button
          id="generate-image-btn"
          style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          onMouseEnter={e => {
            if (!loading && prompt.trim()) {
              e.currentTarget.style.background = "#1a4a82";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#2f6fb5";
          }}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {error && (
          <p id="image-error" style={styles.error}>{error}</p>
        )}

        {result && (
          <div style={styles.resultBox}>
            {imageLoading && (
              <div style={styles.loadingBox}>
                <div style={styles.spinner} />
                <p style={styles.loadingText}>
                  Image is being generated... This may take a few seconds.
                </p>
              </div>
            )}
            <img
              ref={imgRef}
              src={result.image_url}
              alt={result.safe_prompt}
              referrerPolicy="no-referrer"
              style={{
                ...styles.image,
                display: imageLoading ? "none" : "block"
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoading && (
              <p style={styles.promptNote}>
                <strong>Prompt used:</strong> {result.safe_prompt}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(20,50,100,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "24px",
    backdropFilter: "blur(4px)"
  },
  panel: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "32px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 8px 48px rgba(30,80,160,0.18)",
    border: "1px solid #ccdaec",
    animation: "fadeIn 0.2s ease-out"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  title: {
    fontFamily: "'Lora', serif",
    fontSize: "20px",
    color: "#1a4a82"
  },
  close: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#5a7080",
    transition: "color 0.2s"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #ccdaec",
    borderRadius: "10px",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    resize: "none",
    background: "#f4f7fb",
    color: "#1a2a3a",
    marginBottom: "14px",
    outline: "none"
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#2f6fb5",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    marginBottom: "16px",
    transition: "background 0.2s"
  },
  error: {
    color: "#c0392b",
    fontSize: "14px",
    marginBottom: "12px"
  },
  resultBox: {
    marginTop: "8px"
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f4f7fb",
    borderRadius: "10px",
    border: "1px solid #ccdaec",
    marginBottom: "10px"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #ccdaec",
    borderTopColor: "#2f6fb5",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginBottom: "14px"
  },
  loadingText: {
    fontSize: "14px",
    color: "#5a7080",
    textAlign: "center",
    margin: 0
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #ccdaec",
    marginBottom: "10px"
  },
  promptNote: {
    fontSize: "12px",
    color: "#5a7080",
    lineHeight: "1.5"
  }
};
