const DENOMINATIONS = [
  {
    value: "Protestant",
    label: "Protestant",
    icon: "✝️",
    desc: "Bible-centered, grace through faith",
  },
  {
    value: "Catholic",
    label: "Catholic",
    icon: "⛪",
    desc: "Sacred tradition & Magisterium",
  },
  {
    value: "Orthodox",
    label: "Orthodox",
    icon: "☦️",
    desc: "Ancient liturgy & theosis",
  },
  {
    value: "Non-denominational",
    label: "Non-denominational",
    icon: "🕊️",
    desc: "Scripture alone, no creed",
  },
];

export default function DenominationPicker({ onSelect }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Branding */}
        <div style={styles.logoWrap}>
          <div style={styles.logo}>🕊️</div>
        </div>
        <h1 style={styles.title}>Christian AI Assistant</h1>
        <p style={styles.subtitle}>
          To give you the most accurate theological answers,
          <br />
          please select your tradition:
        </p>

        <div style={styles.grid}>
          {DENOMINATIONS.map((d) => (
            <button
              key={d.value}
              id={`denomination-${d.value.toLowerCase()}`}
              style={styles.option}
              onClick={() => onSelect(d.value)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2f6fb5";
                e.currentTarget.style.background = "#eaf2fc";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(30,80,160,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d8e6f3";
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(30,80,160,0.06)";
              }}
            >
              <span style={styles.icon}>{d.icon}</span>
              <span style={styles.label}>{d.label}</span>
              <span style={styles.desc}>{d.desc}</span>
            </button>
          ))}
        </div>

        <p style={styles.note}>
          You can ask about any tradition — this just helps me tailor responses.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(160deg, #f4f7fb 0%, #e8f0fa 50%, #ddeaf8 100%)",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "48px 40px 36px",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 8px 48px rgba(30,80,160,0.12)",
    border: "1px solid #d8e6f3",
    textAlign: "center",
  },
  logoWrap: {
    marginBottom: "16px",
    display: "flex",
    justifyContent: "center",
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
  title: {
    fontFamily: "'Lora', serif",
    fontSize: "26px",
    color: "#1a4a82",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#5a7080",
    lineHeight: "1.6",
    marginBottom: "28px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "24px",
  },
  option: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "20px 14px 16px",
    background: "#ffffff",
    border: "1.5px solid #d8e6f3",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    fontSize: "14px",
    color: "#1a2a3a",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 2px 8px rgba(30,80,160,0.06)",
  },
  icon: {
    fontSize: "30px",
  },
  label: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#1a4a82",
  },
  desc: {
    fontSize: "11px",
    color: "#8a9ab0",
    lineHeight: "1.4",
    fontWeight: "400",
  },
  note: {
    fontSize: "13px",
    color: "#8a9ab0",
    lineHeight: "1.5",
  },
};
