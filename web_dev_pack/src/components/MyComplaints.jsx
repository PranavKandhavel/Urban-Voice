import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import API from "../api"

const TYPE_CONFIG = {
  garbage:     { color: "#2ECC71", icon: "🗑️", label: "Garbage" },
  water:       { color: "#3498DB", icon: "🚰", label: "Water Leakage" },
  road:        { color: "#E74C3C", icon: "🛣️", label: "Road Damage" },
  streetlight: { color: "#F1C40F", icon: "💡", label: "Streetlight" },
  traffic:     { color: "#E67E22", icon: "🚦", label: "Traffic" },
};

const STATUS_CONFIG = {
  "Pending":     { color: "#E67E22", bg: "rgba(230,126,34,0.12)" },
  "In Progress": { color: "#3498DB", bg: "rgba(52,152,219,0.12)" },
  "Resolved":    { color: "#2ECC71", bg: "rgba(46,204,113,0.12)" },
};

export default function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
const fetchMyComplaints = async () => {
    try {
      const res = await API.get("/issues/my");
      setComplaints(res.data.map(issue => ({
        id: issue._id,
        title: issue.title,
        type: (issue.category || "road").toLowerCase(),
        location: issue.location?.address || "Unknown location",
        status: issue.status,
        time: new Date(issue.createdAt).toLocaleString(),
        description: issue.description,
        userName: issue.reportedBy?.name || 'You'
      })));
    } catch (err) {
      console.error("Failed to load complaints", err);
      setComplaints([]);
    }
  };
  fetchMyComplaints();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const original = complaints;
    const updated = complaints.filter(c => c.id !== id);
    setComplaints(updated);
    if (selected && selected.id === id) setSelected(null);

    try {
      await API.delete(`/api/issues/${id}`);
      // Success - optimistic worked
    } catch (err) {
      // Rollback on failure
      setComplaints(original);
      // Show toast error
    }
  };


  const filters = ["All", "Pending", "In Progress", "Resolved"];
  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#060e1c", fontFamily: "'Rajdhani', sans-serif" }}>
      <Sidebar onLogout={handleLogout} />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* List panel */}
        <div style={{
          width: selected ? 380 : "100%",
          display: "flex", flexDirection: "column",
          borderRight: selected ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "20px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ color: "#e8eaf0", fontSize: 24, fontWeight: 800, letterSpacing: 0.5 }}>My Complaints</div>
                <div style={{ color: "#3a4560", fontSize: 12, marginTop: 2 }}>Track all your submitted issues</div>
              </div>
              <button
                onClick={() => navigate("/report")}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #2ECC71, #27ae60)",
                  border: "none", borderRadius: 8,
                  color: "#060e1c", fontWeight: 800, fontSize: 12,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <span>+</span> New Report
              </button>
            </div>

            {/* Mini stats */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total", value: stats.total, color: "#3498DB" },
                { label: "Pending", value: stats.pending, color: "#E67E22" },
                { label: "Resolved", value: stats.resolved, color: "#2ECC71" },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                }}>
                  <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ color: "#3a4560", fontSize: 10, letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 14px", borderRadius: 20,
                    border: filter === f ? "1px solid #2ECC71" : "1px solid rgba(255,255,255,0.08)",
                    background: filter === f ? "rgba(46,204,113,0.15)" : "rgba(255,255,255,0.03)",
                    color: filter === f ? "#2ECC71" : "#4a5568",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Complaints list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
            {filtered.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", gap: 12,
              }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <div style={{ color: "#3a4560", fontSize: 15, fontWeight: 600 }}>No complaints found</div>
                <div style={{ color: "#2a3550", fontSize: 12, textAlign: "center" }}>
                  {filter === "All"
                    ? "You haven't reported any issues yet."
                    : `No ${filter.toLowerCase()} complaints.`
                  }
                </div>
                {filter === "All" && (
                  <button
                    onClick={() => navigate("/report")}
                    style={{
                      padding: "8px 20px", borderRadius: 8,
                      background: "rgba(46,204,113,0.15)",
                      border: "1px solid rgba(46,204,113,0.3)",
                      color: "#2ECC71", fontWeight: 700, cursor: "pointer", fontSize: 12,
                    }}
                  >
                    Report an Issue
                  </button>
                )}
              </div>
            ) : (
              filtered.map((c, i) => {
                const typeCfg = TYPE_CONFIG[c.type] || TYPE_CONFIG.road;
                const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG["Pending"];
                const isActive = selected && selected.id === c.id;
                return (
                  <div
                    key={c.id || i}
                    onClick={() => setSelected(isActive ? null : c)}
                    style={{
                      padding: "14px 16px",
                      marginBottom: 8,
                      borderRadius: 12,
                      background: isActive ? "rgba(46,204,113,0.08)" : "rgba(255,255,255,0.03)",
                      border: isActive ? "1px solid rgba(46,204,113,0.2)" : "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      animation: "slideIn 0.3s ease",
                      animationDelay: i * 0.05 + "s",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: typeCfg.color + "18",
                          border: "1px solid " + typeCfg.color + "33",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, flexShrink: 0,
                        }}>
                          {typeCfg.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#e8eaf0", fontSize: 14, fontWeight: 700, marginBottom: 2,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {c.title || "Untitled Issue"}
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ color: typeCfg.color, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
                              {typeCfg.label}
                            </span>
                            <span style={{ color: "#2a3550" }}>·</span>
                            <span style={{ color: "#4a5568", fontSize: 11 }}>📍 {c.location}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, marginLeft: 10 }}>
                        <span style={{
                          padding: "3px 8px", borderRadius: 20,
                          background: statusCfg.bg,
                          color: statusCfg.color,
                          fontSize: 10, fontWeight: 700,
                        }}>
                          {c.status}
                        </span>
                        <span style={{ color: "#2a3550", fontSize: 10 }}>{c.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            flex: 1, overflowY: "auto",
            padding: "28px",
            animation: "slideInRight 0.25s ease",
          }}>
            {(() => {
              const typeCfg = TYPE_CONFIG[selected.type] || TYPE_CONFIG.road;
              const statusCfg = STATUS_CONFIG[selected.status] || STATUS_CONFIG["Pending"];
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                    <button
                      onClick={() => setSelected(null)}
                      style={{ background: "none", border: "none", color: "#3a4560", fontSize: 12, cursor: "pointer", padding: 0 }}>
                      ‹ Back
                    </button>
                  </div>

                  {/* Type badge + icon */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: typeCfg.color + "18",
                      border: "1px solid " + typeCfg.color + "33",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26,
                    }}>
                      {typeCfg.icon}
                    </div>
                    <div>
                      <div style={{ color: typeCfg.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{typeCfg.label}</div>
                      <div style={{ color: "#e8eaf0", fontSize: 20, fontWeight: 800 }}>{selected.title}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <span style={{
                    display: "inline-block",
                    padding: "5px 14px", borderRadius: 20,
                    background: statusCfg.bg, color: statusCfg.color,
                    fontSize: 12, fontWeight: 700, marginBottom: 20,
                  }}>
                    {selected.status}
                  </span>

                  {/* Info grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "Location", value: selected.location, icon: "📍" },
                      { label: "Reported", value: selected.time, icon: "🕐" },
                      { label: "Reported by", value: selected.userName || "You", icon: "👤" },
                      { label: "Issue ID", value: "#" + String(selected.id).slice(-5), icon: "🔖" },
                    ].map(info => (
                      <div key={info.label} style={{
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10,
                      }}>
                        <div style={{ color: "#3a4560", fontSize: 10, letterSpacing: 0.5, marginBottom: 4 }}>{info.icon} {info.label}</div>
                        <div style={{ color: "#c8d0e0", fontSize: 13, fontWeight: 600 }}>{info.value || "—"}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {selected.description && (
                    <div style={{
                      padding: "14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10, marginBottom: 20,
                    }}>
                      <div style={{ color: "#3a4560", fontSize: 10, letterSpacing: 0.5, marginBottom: 6 }}>📝 Description</div>
                      <div style={{ color: "#c8d0e0", fontSize: 13, lineHeight: 1.6 }}>{selected.description}</div>
                    </div>
                  )}

                  {/* Progress steps */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: "#5a6a88", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Progress</div>
                    {[
                      { step: "Submitted", done: true },
                      { step: "Under Review", done: selected.status !== "Pending" },
                      { step: "In Progress", done: selected.status === "Resolved" },
                      { step: "Resolved", done: selected.status === "Resolved" },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "center" }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: s.done ? "#2ECC71" : "rgba(255,255,255,0.06)",
                          border: "2px solid " + (s.done ? "#2ECC71" : "rgba(255,255,255,0.1)"),
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 11, color: "#060e1c", fontWeight: 800,
                        }}>
                          {s.done ? "✓" : ""}
                        </div>
                        <span style={{ color: s.done ? "#c8d0e0" : "#3a4560", fontSize: 13 }}>{s.step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(selected.id)}
                    style={{
                      width: "100%", padding: "11px",
                      background: "rgba(231,76,60,0.08)",
                      border: "1px solid rgba(231,76,60,0.2)",
                      borderRadius: 8, color: "#E74C3C",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(231,76,60,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(231,76,60,0.08)"}
                  >
                    🗑️ Delete Complaint
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;800&display=swap');
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(46,204,113,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
