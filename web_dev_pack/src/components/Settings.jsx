import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import API from "../api";
 
export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [profile, setProfile] = useState({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };
 
  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };
 
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Optimistic update in localStorage
      const updated = { ...user, ...profile };
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      showMsg("Profile updated successfully!");
    } catch (err) {
      showMsg("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };
 
  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showMsg("All password fields are required", "error"); return;
    }
    if (passwords.new !== passwords.confirm) {
      showMsg("New passwords don't match", "error"); return;
    }
    if (passwords.new.length < 6) {
      showMsg("Password must be at least 6 characters", "error"); return;
    }
    setSaving(true);
    try {
      const res = await API.put('/api/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      
      // Update token and localStorage
      localStorage.setItem('token', res.data.token);
      showMsg("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error(err);
      showMsg(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };
 
  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "#E74C3C" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8, color: "#e8eaf0", fontSize: 13,
    outline: "none", fontFamily: "'Rajdhani', sans-serif",
    transition: "border-color 0.2s",
  });
 
  const labelStyle = {
    color: "#5a6a88", fontSize: 11, letterSpacing: 1,
    textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600,
  };
 
  const tabs = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "security", icon: "🔒", label: "Security" },
    { id: "about", icon: "ℹ️", label: "About" },
  ];
 
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#060e1c", fontFamily: "'Rajdhani', sans-serif" }}>
      <Sidebar onLogout={handleLogout} />
 
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,16,32,0.8)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ color: "#e8eaf0", fontSize: 24, fontWeight: 800, letterSpacing: 0.5 }}>Settings</div>
          <div style={{ color: "#3a4560", fontSize: 12, marginTop: 2 }}>Manage your account & preferences</div>
        </div>
 
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Tabs sidebar */}
          <div style={{
            width: 200,
            background: "rgba(8,16,32,0.6)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 0",
          }}>
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 20px",
                  cursor: "pointer",
                  background: activeTab === tab.id ? "rgba(46,204,113,0.1)" : "transparent",
                  borderLeft: `3px solid ${activeTab === tab.id ? "#2ECC71" : "transparent"}`,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                <span style={{ color: activeTab === tab.id ? "#2ECC71" : "#5a6a88", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500 }}>
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
 
          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
            {/* Toast */}
            {msg && (
              <div style={{
                position: "fixed", top: 24, right: 24, zIndex: 999,
                padding: "12px 20px", borderRadius: 10,
                background: msg.type === "error" ? "rgba(231,76,60,0.15)" : "rgba(46,204,113,0.15)",
                border: `1px solid ${msg.type === "error" ? "#E74C3C" : "#2ECC71"}`,
                color: msg.type === "error" ? "#E74C3C" : "#2ECC71",
                fontSize: 13, fontWeight: 600,
                animation: "slideInRight 0.3s ease",
              }}>
                {msg.type === "error" ? "❌" : "✅"} {msg.text}
              </div>
            )}
 
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div style={{ maxWidth: 520 }}>
                <div style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Profile Info</div>
                <div style={{ color: "#3a4560", fontSize: 12, marginBottom: 28 }}>Update your personal details</div>
 
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, #2ECC71, #3498DB)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#060e1c", fontWeight: 800, fontSize: 26,
                    boxShadow: "0 0 20px rgba(46,204,113,0.3)",
                  }}>
                    {(profile.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "#e8eaf0", fontSize: 16, fontWeight: 700 }}>{profile.name || "User"}</div>
                    <div style={{ color: "#3a4560", fontSize: 12 }}>{user.role === "authority" ? "🏛️ Authority" : "👤 Citizen"}</div>
                  </div>
                </div>
 
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      style={inputStyle(false)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                      style={inputStyle(false)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      style={inputStyle(false)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <div style={{
                      padding: "11px 14px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, color: "#5a6a88", fontSize: 13,
                    }}>
                      {user.role === "authority" ? "Authority / Admin" : "Citizen"}
                    </div>
                  </div>
 
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      padding: "12px 28px", borderRadius: 8, width: "fit-content",
                      background: "linear-gradient(135deg, #2ECC71, #27ae60)",
                      border: "none", color: "#060e1c", fontWeight: 800,
                      fontSize: 13, cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.7 : 1, transition: "all 0.2s",
                      marginTop: 8,
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
 
            {/* Security Tab */}
            {activeTab === "security" && (
              <div style={{ maxWidth: 520 }}>
                <div style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Security</div>
                <div style={{ color: "#3a4560", fontSize: 12, marginBottom: 28 }}>Change your password</div>
 
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { key: "current", label: "Current Password" },
                    { key: "new", label: "New Password" },
                    { key: "confirm", label: "Confirm New Password" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPass[key] ? "text" : "password"}
                          value={passwords[key]}
                          onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                          style={{ ...inputStyle(false), paddingRight: 42 }}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))}
                          style={{
                            position: "absolute", right: 12, top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none",
                            color: "#3a4560", cursor: "pointer",
                            fontSize: 16, padding: 0,
                            display: "flex", alignItems: "center",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = "#2ECC71"}
                          onMouseLeave={e => e.currentTarget.style.color = "#3a4560"}
                        >
                          {showPass[key] ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>
                  ))}
 
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    style={{
                      padding: "12px 28px", borderRadius: 8, width: "fit-content",
                      background: "linear-gradient(135deg, #3498DB, #2980b9)",
                      border: "none", color: "#fff", fontWeight: 800,
                      fontSize: 13, cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.7 : 1, marginTop: 8,
                    }}
                  >
                    {saving ? "Updating..." : "Change Password"}
                  </button>
                </div>
 
                <div style={{
                  marginTop: 32, padding: "16px 20px",
                  background: "rgba(231,76,60,0.06)",
                  border: "1px solid rgba(231,76,60,0.15)",
                  borderRadius: 10,
                }}>
                  <div style={{ color: "#E74C3C", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>⚠️ Danger Zone</div>
                  <div style={{ color: "#5a6a88", fontSize: 12, marginBottom: 12 }}>Logging out will clear your session.</div>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "8px 18px", borderRadius: 6,
                      background: "rgba(231,76,60,0.12)",
                      border: "1px solid rgba(231,76,60,0.3)",
                      color: "#E74C3C", fontWeight: 700, fontSize: 12, cursor: "pointer",
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
 
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div style={{ maxWidth: 520 }}>
                <div style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Notifications</div>
                <div style={{ color: "#3a4560", fontSize: 12, marginBottom: 28 }}>Control how you receive alerts</div>
 
                {[
                  { label: "Issue status updates", desc: "Get notified when your issue status changes", def: true },
                  { label: "New upvotes", desc: "When someone upvotes your reported issue", def: true },
                  { label: "Issue resolved", desc: "When your issue is marked as resolved", def: true },
                  { label: "System announcements", desc: "Platform updates and announcements", def: false },
                ].map((item, i) => {
                  const [on, setOn] = useState(item.def);
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "16px 20px", marginBottom: 8,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10,
                    }}>
                      <div>
                        <div style={{ color: "#c8d0e0", fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                        <div style={{ color: "#3a4560", fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <div
                        onClick={() => setOn(!on)}
                        style={{
                          width: 44, height: 24, borderRadius: 12,
                          background: on ? "#2ECC71" : "rgba(255,255,255,0.1)",
                          position: "relative", cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                      >
                        <div style={{
                          position: "absolute", top: 3,
                          left: on ? 22 : 3,
                          width: 18, height: 18, borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.3s",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
 
            {/* About Tab */}
            {activeTab === "about" && (
              <div style={{ maxWidth: 520 }}>
                <div style={{ color: "#e8eaf0", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>About Urban Voice</div>
                <div style={{ color: "#3a4560", fontSize: 12, marginBottom: 28 }}>Platform information</div>
 
                <div style={{
                  padding: "24px", borderRadius: 12,
                  background: "rgba(46,204,113,0.06)",
                  border: "1px solid rgba(46,204,113,0.15)",
                  marginBottom: 20,
                  textAlign: "center",
                }}>
                  <div style={{ color: "#2ECC71", fontSize: 28, fontWeight: 900, letterSpacing: 2, fontFamily: "'Orbitron', sans-serif" }}>URBAN</div>
                  <div style={{ color: "#3498DB", fontSize: 28, fontWeight: 900, letterSpacing: 2, fontFamily: "'Orbitron', sans-serif", marginTop: -6 }}>VOICE</div>
                  <div style={{ color: "#5a6a88", fontSize: 12, marginTop: 8 }}>v1.0.0 · Coimbatore Civic Platform</div>
                </div>
 
                {[
                  { label: "Platform", value: "Urban Voice — Civic Issue Reporter" },
                  { label: "Region", value: "Coimbatore, Tamil Nadu" },
                  { label: "Version", value: "1.0.0" },
                  { label: "Stack", value: "React + Node.js + MongoDB" },
                  { label: "Your Role", value: user.role === "authority" ? "Authority / Administrator" : "Citizen" },
                  { label: "Account ID", value: user._id ? "#" + String(user._id).slice(-8) : "—" },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{ color: "#3a4560", fontSize: 12 }}>{item.label}</span>
                    <span style={{ color: "#c8d0e0", fontSize: 12, fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;800;900&display=swap');
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; }
        input:focus { border-color: rgba(46,204,113,0.5) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(46,204,113,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
 
