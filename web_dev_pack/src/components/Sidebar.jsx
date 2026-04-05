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
      width: collapsed ? 70 : 224,
      height: "100vh",
      background: "rgba(8,16,32,0.97)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(46,204,113,0.18)",
      display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      flexShrink: 0,
      position: "relative",
      zIndex: 200,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "22px 0" : "22px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 10,
      }}>
        {!collapsed && (
          <div>
            <div style={{ color: "#2ECC71", fontSize: 17, fontWeight: 800, letterSpacing: 1, fontFamily: "'Orbitron', sans-serif" }}>URBAN</div>
            <div style={{ color: "#3498DB", fontSize: 17, fontWeight: 800, letterSpacing: 1, fontFamily: "'Orbitron', sans-serif", marginTop: -4 }}>VOICE</div>
          </div>
        )}
        {collapsed && (
          <div style={{ color: "#2ECC71", fontSize: 20, fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>UV</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(46,204,113,0.12)",
            border: "1px solid rgba(46,204,113,0.25)",
            borderRadius: 6,
            color: "#2ECC71",
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 13,
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(46,204,113,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(46,204,113,0.12)"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>
 
      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: 12,
                padding: collapsed ? "13px 0" : "13px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer",
                background: active ? "rgba(46,204,113,0.13)" : "transparent",
                borderLeft: active ? "3px solid #2ECC71" : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: 2,
                position: "relative",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderLeft = "3px solid rgba(46,204,113,0.3)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderLeft = "3px solid transparent";
                }
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{
                  color: active ? "#2ECC71" : "#aab4cc",
                  fontSize: 13, fontWeight: active ? 700 : 600,
                  letterSpacing: 0.3, transition: "color 0.2s",
                }}>
                  {item.label}
                </span>
              )}
              {/* Active dot indicator */}
              {active && !collapsed && (
                <div style={{
                  marginLeft: "auto",
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#2ECC71",
                  boxShadow: "0 0 8px #2ECC71",
                }} />
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div style={{
                  position: "absolute", left: "calc(100% + 10px)", top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(8,16,32,0.95)",
                  border: "1px solid rgba(46,204,113,0.2)",
                  borderRadius: 6, padding: "5px 10px",
                  color: active ? "#2ECC71" : "#c8d0e0",
                  fontSize: 12, fontWeight: 600,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  zIndex: 500,
                }} className="nav-tooltip">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>
 
      {/* Map legend */}
      {!collapsed && (
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ color: "#5a6a88", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Legend</div>
          {[
            { color: "#2ECC71", label: "Garbage" },
            { color: "#3498DB", label: "Water" },
            { color: "#E74C3C", label: "Road" },
            { color: "#F1C40F", label: "Streetlight" },
            { color: "#E67E22", label: "Traffic" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, boxShadow: "0 0 6px " + l.color, flexShrink: 0 }} />
              <span style={{ color: "#8a9ab8", fontSize: 11 }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}
 
      {/* Logout */}
      <div style={{ padding: collapsed ? "14px 0" : "14px 20px", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
        <button
          onClick={() => confirm("Are you sure you want to log out?") && onLogout()}
          style={{
            background: "rgba(231,76,60,0.1)",
            border: "1px solid rgba(231,76,60,0.25)",
            borderRadius: 8,
            color: "#E74C3C",
            padding: collapsed ? "9px 10px" : "9px 16px",
            cursor: "pointer", fontSize: 12,
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(231,76,60,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(231,76,60,0.1)"}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;800&display=swap');
        nav > div:hover .nav-tooltip { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
