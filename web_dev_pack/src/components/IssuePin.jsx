import { useState } from "react";

const ISSUE_CONFIG = {
  garbage:     { color: "#2ECC71", label: "Garbage",       icon: "🗑️" },
  water:       { color: "#3498DB", label: "Water Leakage", icon: "🚰" },
  road:        { color: "#E74C3C", label: "Road Damage",   icon: "🛣️" },
  streetlight: { color: "#F1C40F", label: "Streetlight",   icon: "💡" },
  traffic:     { color: "#E67E22", label: "Traffic",       icon: "🚦" },
};

export default function IssuePin({ type = "road", title, location, time, x, y, onClick }) {
  const [hovered, setHovered] = useState(false);
  const cfg = ISSUE_CONFIG[type] || ISSUE_CONFIG.road;

  return (
    <div
      style={{
        position: "absolute",
        left: x + "%",
        top: y + "%",
        transform: "translate(-50%, -100%)",
        cursor: "pointer",
        zIndex: hovered ? 100 : 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick && onClick({ type, title, location, time, cfg })}
    >
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 44, height: 44, borderRadius: "50%",
        background: cfg.color, opacity: 0.15,
        animation: "pinPulse 2s ease-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 30, height: 30, borderRadius: "50%",
        background: cfg.color, opacity: 0.25,
        animation: "pinPulse 2s ease-out infinite 0.4s",
      }} />
      <div style={{
        width: 36, height: 36,
        borderRadius: "50% 50% 50% 0",
        background: cfg.color,
        transform: hovered ? "rotate(-45deg) scale(1.2)" : "rotate(-45deg)",
        boxShadow: "0 4px 20px " + cfg.color + "88",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s ease",
      }}>
        <span style={{ transform: "rotate(45deg)", fontSize: 15 }}>{cfg.icon}</span>
      </div>

      {hovered && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 10px)", left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10,20,40,0.95)",
          border: "1px solid " + cfg.color + "55",
          borderRadius: 10, padding: "8px 12px", minWidth: 160,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          <div style={{ color: cfg.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{cfg.label}</div>
          <div style={{ color: "#e8eaf0", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{title}</div>
          <div style={{ color: "#7a8399", fontSize: 11 }}>📍 {location}</div>
          {time && <div style={{ color: "#4a5568", fontSize: 10, marginTop: 3 }}>{time}</div>}
          <div style={{
            position: "absolute", bottom: -6, left: "50%",
            transform: "translateX(-50%)",
            width: 10, height: 6,
            background: "rgba(10,20,40,0.95)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }} />
        </div>
      )}
    </div>
  );
}
