import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const NAV = [
  { icon: "📍", label: "Nearby Issues",  path: "/dashboard" },
  { icon: "📝", label: "Report Issue",   path: "/report", adminHide: true },
  { icon: "📊", label: "My Complaints",  path: "/my-complaints", adminLabel: "Manage Complaints" },
  { icon: "⚙️", label: "Settings",       path: "/settings" },
];

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isDark, toggle, t } = useTheme();

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <div style={{
      width: collapsed ? 70 : 224,
      height: "100vh",
      background: t.sidebar,
      backdropFilter: "blur(20px)",
      borderRight: `1px solid ${t.borderGreen}`,
      display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      flexShrink: 0,
      position: "relative",
      zIndex: 200,
    }}>
      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setShowLogoutConfirm(false)}>
          <div style={{
            background: t.bgPanel,
            border: '1px solid rgba(231,76,60,0.4)',
            borderRadius: 20,
            padding: '40px',
            minWidth: 380,
            maxWidth: '95vw',
            maxHeight: '90vh',
            textAlign: 'center',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🚪</div>
            <div style={{ color: t.textPrimary, fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
              Log out?
            </div>
            <div style={{ color: t.textMuted, fontSize: 16, lineHeight: 1.5, marginBottom: 36 }}>
              Are you sure you want to log out? You'll need to log in again to continue.
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, maxWidth: 140, padding: '14px 24px', borderRadius: 12,
                  background: t.bgCard, border: `1px solid ${t.border}`,
                  color: t.textPrimary, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1, maxWidth: 140, padding: '14px 24px', borderRadius: 12,
                  background: 'rgba(231,76,60,0.2)', border: '1px solid rgba(231,76,60,0.5)',
                  color: '#E74C3C', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <div style={{
        padding: collapsed ? "22px 0" : "22px 20px",
        borderBottom: `1px solid ${t.border}`,
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 10,
      }}>
        {/* URBAN VOICE wordmark — clickable */}
        <div
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer", lineHeight: 1 }}
          title="Go to Nearby Issues"
        >
          {!collapsed && (
            <div>
              <div style={{
                color: "#2ECC71", fontSize: 17, fontWeight: 800,
                letterSpacing: 1, fontFamily: "'Orbitron', sans-serif",
                marginBottom: 3,
              }}>URBAN</div>
              <div style={{
                color: "#3498DB", fontSize: 17, fontWeight: 800,
                letterSpacing: 1, fontFamily: "'Orbitron', sans-serif",
              }}>VOICE</div>
            </div>
          )}
          {collapsed && (
            <div style={{ color: "#2ECC71", fontSize: 20, fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>UV</div>
          )}
        </div>

        {/* Collapse toggle */}
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
          const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
          const isAdmin = user.role === 'authority';
          if (isAdmin && item.adminHide) return null;

          const label = isAdmin && item.adminLabel ? item.adminLabel : item.label;
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
                  e.currentTarget.style.background = t.bgCardHover;
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
                  color: active ? "#2ECC71" : t.textSecond,
                  fontSize: 13, fontWeight: active ? 700 : 600,
                  letterSpacing: 0.3, transition: "color 0.2s",
                }}>
                  {label}
                </span>
              )}
              {active && !collapsed && (
                <div style={{
                  marginLeft: "auto",
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#2ECC71",
                  boxShadow: "0 0 8px #2ECC71",
                }} />
              )}
              {collapsed && (
                <div style={{
                  position: "absolute", left: "calc(100% + 10px)", top: "50%",
                  transform: "translateY(-50%)",
                  background: t.bgPanel,
                  border: `1px solid ${t.borderGreen}`,
                  borderRadius: 6, padding: "5px 10px",
                  color: active ? "#2ECC71" : t.textPrimary,
                  fontSize: 12, fontWeight: 600,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  zIndex: 500,
                }} className="nav-tooltip">
                  {label}
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
          borderTop: `1px solid ${t.border}`,
          borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ color: t.textDim, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Legend</div>
          {[
            { color: "#2ECC71", label: "Garbage" },
            { color: "#3498DB", label: "Water" },
            { color: "#E74C3C", label: "Road" },
            { color: "#F1C40F", label: "Streetlight" },
            { color: "#95A5A6", label: "Other", emoji: "❓" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, boxShadow: "0 0 6px " + l.color, flexShrink: 0 }} />
              <span style={{ color: t.textMuted, fontSize: 11 }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Theme toggle */}
      <div style={{
        padding: collapsed ? "12px 0" : "12px 20px",
        display: "flex",
        justifyContent: collapsed ? "center" : "flex-start",
        borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={toggle}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            background: isDark ? "rgba(241,196,15,0.12)" : "rgba(52,152,219,0.12)",
            border: isDark ? "1px solid rgba(241,196,15,0.3)" : "1px solid rgba(52,152,219,0.3)",
            borderRadius: 8,
            color: isDark ? "#F1C40F" : "#3498DB",
            padding: collapsed ? "9px 10px" : "9px 16px",
            cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <span>{isDark ? "☀️" : "🌙"}</span>
          {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>

      {/* Logout */}
      <div style={{ padding: collapsed ? "14px 0" : "14px 20px", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
        <button
          onClick={() => setShowLogoutConfirm(true)}
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
