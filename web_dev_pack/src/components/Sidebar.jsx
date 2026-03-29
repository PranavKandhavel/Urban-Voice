import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { icon: "📍", label: "Nearby Issues",  path: "/dashboard" },
  { icon: "📝", label: "Report Issue",   path: "/report" },
  { icon: "📊", label: "My Complaints",  path: "/my-complaints" },
  { icon: "⚙️", label: "Settings",       path: "/settings" },
];

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      width: collapsed ? 64 : 220,
      height: "100vh",
      background: "rgba(8,16,32,0.97)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(46,204,113,0.15)",
      display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      flexShrink: 0,
      position: "relative",
      zIndex: 200,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "22px 0" : "22px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 10,
      }}>
        {!collapsed && (
          <div>
            <div style={{ color: "#2ECC71", fontSize: 18, fontWeight: 800, letterSpacing: 1, fontFamily: "'Orbitron', sans-serif" }}>
              URBAN
            </div>
            <div style={{ color: "#3498DB", fontSize: 18, fontWeight: 800, letterSpacing: 1, fontFamily: "'Orbitron', sans-serif", marginTop: -4 }}>
              VOICE
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ color: "#2ECC71", fontSize: 22, fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>UV</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(46,204,113,0.1)",
            border: "1px solid rgba(46,204,113,0.2)",
            borderRadius: 6,
            color: "#2ECC71",
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 12,
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: 12,
                padding: collapsed ? "14px 0" : "14px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer",
                background: active ? "rgba(46,204,113,0.12)" : "transparent",
                borderLeft: active ? "3px solid #2ECC71" : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: 2,
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{
                  color: active ? "#2ECC71" : "#7a8aaa",
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  letterSpacing: 0.3, transition: "color 0.2s",
                }}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Map legend */}
      {!collapsed && (
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ color: "#3a4560", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Legend</div>
          {[
            { color: "#2ECC71", label: "Garbage" },
            { color: "#3498DB", label: "Water" },
            { color: "#E74C3C", label: "Road" },
            { color: "#F1C40F", label: "Streetlight" },
            { color: "#E67E22", label: "Traffic" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, boxShadow: "0 0 6px " + l.color }} />
              <span style={{ color: "#5a6a88", fontSize: 11 }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: collapsed ? "16px 0" : "16px 20px", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
        <button
          onClick={onLogout}
          style={{
            background: "rgba(231,76,60,0.1)",
            border: "1px solid rgba(231,76,60,0.2)",
            borderRadius: 8,
            color: "#E74C3C",
            padding: collapsed ? "8px" : "8px 16px",
            cursor: "pointer", fontSize: 12,
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(231,76,60,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(231,76,60,0.1)"}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
