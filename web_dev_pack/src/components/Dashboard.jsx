import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import UpvoteButton from "./UpvoteButton";
import { useTheme } from "../ThemeContext";
import API from "../api";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEMO_ISSUES = [
  { id: 1, type: "garbage",     title: "Overflowing bin",      location: "Gandhipuram",   time: "2 hrs ago",  lat: 11.0188, lng: 76.9668, upvoteCount: 0 },
  { id: 2, type: "water",       title: "Water leakage",        location: "Peelamedu",     time: "4 hrs ago",  lat: 11.0268, lng: 77.0068, upvoteCount: 0 },
  { id: 3, type: "road",        title: "Pothole on main road", location: "RS Puram",      time: "1 hr ago",   lat: 11.0068, lng: 76.9458, upvoteCount: 0 },
  { id: 4, type: "streetlight", title: "Light not working",    location: "Saibaba Colony",time: "6 hrs ago",  lat: 11.0368, lng: 76.9468, upvoteCount: 0 },
  { id: 5, type: "traffic",     title: "Signal malfunction",   location: "Hopes College", time: "30 min ago", lat: 11.0288, lng: 77.0168, upvoteCount: 0 },
  { id: 6, type: "garbage",     title: "Roadside dumping",     location: "Singanallur",   time: "3 hrs ago",  lat: 10.9968, lng: 77.0268, upvoteCount: 0 },
  { id: 7, type: "road",        title: "Road crack",           location: "Race Course",   time: "5 hrs ago",  lat: 10.9968, lng: 76.9768, upvoteCount: 0 },
  { id: 8, type: "water",       title: "Burst pipe",           location: "Ukkadam",       time: "1 hr ago",   lat: 10.9918, lng: 76.9568, upvoteCount: 0 },
];

const TYPE_CONFIG = {
  garbage:     { color: "#2ECC71", icon: "🗑️", label: "Garbage" },
  water:       { color: "#3498DB", icon: "🚰", label: "Water Leakage" },
  road:        { color: "#E74C3C", icon: "🛣️", label: "Road Damage" },
  streetlight: { color: "#F1C40F", icon: "💡", label: "Streetlight" },
  other:       { color: "#95A5A6", icon: "❓", label: "Other" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark, t } = useTheme();
  const [selectedPin, setSelectedPin] = useState(null);
  const [allIssues, setAllIssues] = useState(DEMO_ISSUES);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("active");
  const [loading, setLoading] = useState(true);

  const updateIssueUpvote = useCallback((issueId, data) => {
    setAllIssues(prev => prev.map(issue =>
      (issue.id === issueId || issue._id === issueId)
        ? { ...issue, upvoteCount: data.upvoteCount || issue.upvoteCount }
        : issue
    ));
  }, []);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/issues", { timeout: 30000 });
      const issues = res.data.map((issue) => ({
        id: issue._id,
        type: issue.category === 'Roads' ? 'road'
          : issue.category === 'Water' ? 'water'
          : issue.category === 'Garbage' ? 'garbage'
          : issue.category === 'Streetlight' ? 'streetlight'
          : (issue.category === 'Traffic' || issue.category === 'Other') ? 'other'
          : (issue.type || 'other').toLowerCase(),
        title: issue.title,
        status: issue.status || "Pending",
        location: issue.location?.address || issue.location || "Unknown",
        upvoteCount: issue.upvoteCount || 0,
        userUpvoted: issue.userUpvoted || false,
        time: new Date(issue.createdAt || Date.now()).toLocaleString(),
        lat: issue.location?.coordinates?.[1] || (11.0168 + (Math.random() - 0.5) * 0.05),
        lng: issue.location?.coordinates?.[0] || (76.9558 + (Math.random() - 0.5) * 0.05),
        photo: issue.photo?.url || null,
      }));
      setAllIssues(issues.length > 0 ? issues : DEMO_ISSUES);
    } catch (err) {
      console.error("Failed to load issues from backend:", err);
      setAllIssues(DEMO_ISSUES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 30000);
    return () => clearInterval(interval);
  }, [fetchIssues]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const filtered = allIssues
    .filter((i) => filterType === "all" || i.type === filterType.toLowerCase())
    .filter((i) => filterStatus === "all" || i.status !== "Resolved");

  const displayStats = {
    total: filtered.length,
    resolved: filtered.filter(i => i.status === "Resolved").length,
    pending: filtered.filter(i => i.status !== "Resolved").length,
  };

  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  // Map tile — switch between dark and light
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  // Inactive filter button style — theme-aware
  const inactiveBtn = {
    border: `1px solid ${t.border}`,
    background: t.bgCard,
    color: t.textMuted,
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: t.bg, overflow: "hidden", fontFamily: "'Rajdhani', sans-serif" }}>
      <Sidebar onLogout={handleLogout} />

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        {/* Map */}
        <MapContainer
          center={[11.0168, 76.9558]}
          zoom={13}
          style={{ position: "absolute", inset: 0, zIndex: 10, width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer url={tileUrl} attribution="&copy; OpenStreetMap contributors &amp; CartoDB" />
          {filtered.map(issue => {
            const cfg = TYPE_CONFIG[issue.type] || TYPE_CONFIG.road;
            return (
              <CircleMarker
                key={issue.id}
                center={[issue.lat, issue.lng]}
                radius={10}
                pathOptions={{ color: cfg.color, fillColor: cfg.color, fillOpacity: 0.8, weight: 3 }}
                eventHandlers={{ click: () => setSelectedPin({ ...issue, cfg }) }}
              >
                <Tooltip direction="top" opacity={1} offset={[0, -10]}>
                  <div style={{ color: "#000", fontWeight: "bold" }}>{cfg.icon} {issue.title}</div>
                  <div style={{ fontSize: "10px" }}>{issue.location}</div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px",
          background: t.topbar,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${t.borderGreen}`,
          zIndex: 50,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Type filter pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "road", "water", "garbage", "streetlight", "other"].map(type => {
                const active = filterType === type;
                const activeColor = TYPE_CONFIG[type]?.color || "#2ECC71";
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                      padding: "5px 12px", borderRadius: 20,
                      border: active ? `1px solid ${activeColor}` : inactiveBtn.border,
                      background: active ? activeColor + "22" : inactiveBtn.background,
                      color: active ? activeColor : inactiveBtn.color,
                      fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                      position: "relative", zIndex: 1000,
                      transition: "all 0.2s",
                    }}
                  >
                    {type === "all" ? "All Issues" : type}
                  </button>
                );
              })}
            </div>
            {/* Status filter pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {["active", "all", "pending"].map(s => {
                const active = filterStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      padding: "5px 12px", borderRadius: 20,
                      border: active ? "1px solid #2ECC71" : inactiveBtn.border,
                      background: active ? "rgba(46,204,113,0.15)" : inactiveBtn.background,
                      color: active ? "#2ECC71" : inactiveBtn.color,
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {s === "active" ? "Active" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: t.textPrimary, fontSize: 12, fontWeight: 600 }}>{user.name || "User"}</div>
              <div style={{ color: t.textMuted, fontSize: 10 }}>{user.email || ""}</div>
            </div>
            <div
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #2ECC71, #3498DB)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#060e1c", fontWeight: 800, fontSize: 14, cursor: "pointer",
              }}
              title="Go to Profile"
              onClick={() => navigate("/settings", { state: { tab: "profile" } })}
            >
              {(user.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", gap: 1, zIndex: 40 }}>
          {[
            { label: "Total Issues", value: displayStats.total,    color: "#3498DB" },
            { label: "Pending",      value: displayStats.pending,  color: "#E74C3C" },
            { label: "Resolved",     value: displayStats.resolved, color: "#2ECC71" },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, padding: "8px 16px",
              background: t.statsBar,
              backdropFilter: "blur(8px)",
              borderBottom: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 3, height: 28, background: s.color, borderRadius: 2 }} />
              <div>
                <div style={{ color: s.color, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: t.textMuted, fontSize: 10, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pin detail modal */}
        {selectedPin && (
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
            onClick={() => setSelectedPin(null)}
          >
            <div
              style={{
                background: t.bgPanel,
                border: "1px solid " + (selectedPin.cfg?.color || "#2ECC71") + "44",
                borderRadius: 16,
                padding: 28,
                width: 340,
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ color: selectedPin.cfg?.color || "#2ECC71", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                    {selectedPin.cfg?.label || "Issue"}
                  </div>
                  <div style={{ color: t.textPrimary, fontSize: 20, fontWeight: 700 }}>{selectedPin.title}</div>
                </div>
                <div style={{ fontSize: 32 }}>{selectedPin.cfg?.icon || "📍"}</div>
              </div>

              {/* Photo */}
              {selectedPin.photo && selectedPin.photo !== "https://via.placeholder.com/400x300/2ECC71/ffffff?text=No+Photo" && (
                <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", border: `1px solid ${selectedPin.cfg?.color || "#2ECC71"}33` }}>
                  <img
                    src={selectedPin.photo}
                    alt="Issue photo"
                    style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }}
                    onError={e => e.currentTarget.style.display = "none"}
                  />
                </div>
              )}

              {/* Location & time */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 6, padding: "4px 10px", color: t.textMuted, fontSize: 12 }}>
                  📍 {selectedPin.location}
                </span>
                {selectedPin.time && (
                  <span style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 6, padding: "4px 10px", color: t.textMuted, fontSize: 12 }}>
                    🕐 {selectedPin.time}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <UpvoteButton
                  issueId={selectedPin.id || selectedPin._id}
                  initialUpvoteCount={selectedPin.upvoteCount || 0}
                  initialUpvoted={selectedPin.userUpvoted || false}
                  onToggle={updateIssueUpvote}
                />
                <button
                  onClick={() => setSelectedPin(null)}
                  style={{
                    flex: 1, padding: "10px",
                    background: t.bgCard,
                    border: `1px solid ${t.border}`,
                    borderRadius: 8,
                    color: t.textMuted,
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #3a4560; }
      `}</style>
    </div>
  );
}