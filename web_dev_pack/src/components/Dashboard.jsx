import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import IssuePin from "./IssuePin";
import UpvoteButton from "./UpvoteButton";
import API from "../api";

const DEMO_ISSUES = [
  { id: 1, type: "garbage",     title: "Overflowing bin",      location: "Gandhipuram",  time: "2 hrs ago",  x: 22, y: 30, upvoteCount: 0 },
  { id: 2, type: "water",       title: "Water leakage",        location: "Peelamedu",    time: "4 hrs ago",  x: 45, y: 48, upvoteCount: 0 },
  { id: 3, type: "road",        title: "Pothole on main road", location: "RS Puram",     time: "1 hr ago",   x: 62, y: 28, upvoteCount: 0 },
  { id: 4, type: "streetlight", title: "Light not working",    location: "Saibaba Colony",time: "6 hrs ago", x: 35, y: 65, upvoteCount: 0 },
  { id: 5, type: "traffic",     title: "Signal malfunction",   location: "Hopes College", time: "30 min ago", x: 72, y: 58, upvoteCount: 0 },
  { id: 6, type: "garbage",     title: "Roadside dumping",     location: "Singanallur",  time: "3 hrs ago",  x: 55, y: 75, upvoteCount: 0 },
  { id: 7, type: "road",        title: "Road crack",           location: "Race Course",  time: "5 hrs ago",  x: 80, y: 40, upvoteCount: 0 },
  { id: 8, type: "water",       title: "Burst pipe",           location: "Ukkadam",      time: "1 hr ago",   x: 28, y: 55, upvoteCount: 0 },
];

const LIVE_FEED = [
  { type: "road",        text: "New Road Damage reported",  location: "RS Puram" },
  { type: "water",       text: "Water Leakage detected",    location: "Peelamedu" },
  { type: "garbage",     text: "Garbage Issue reported",    location: "Gandhipuram" },
  { type: "streetlight", text: "Streetlight down",          location: "Saibaba Colony" },
  { type: "traffic",     text: "Traffic signal fault",      location: "Hopes College" },
];

const TYPE_COLORS = {
  garbage: "#2ECC71", water: "#3498DB", road: "#E74C3C",
  streetlight: "#F1C40F", traffic: "#E67E22",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState(null);
  const [feedIndex, setFeedIndex] = useState(0);
  const [allIssues, setAllIssues] = useState(DEMO_ISSUES);
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  // Fixed: Now correctly receives issueId and data
  const updateIssueUpvote = useCallback((issueId, data) => {
    setAllIssues(prev => prev.map(issue => 
      (issue.id === issueId || issue._id === issueId)
        ? { ...issue, upvoteCount: data.upvoteCount || issue.upvoteCount }
        : issue
    ));
  }, []);

  // Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/issues", { timeout: 30000 });

        const issues = res.data.map((issue) => ({
          id: issue._id,                    // Important: using _id as id
          type: (issue.category || issue.type || "road").toLowerCase(),
          title: issue.title,
          location: issue.location?.address || issue.location || "Unknown",
          upvoteCount: issue.upvoteCount || 0,
          userUpvoted: issue.userUpvoted || false,   // Added for upvote state
          time: new Date(issue.createdAt || Date.now()).toLocaleString(),
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
        }));

        setAllIssues(issues.length > 0 ? issues : DEMO_ISSUES);

        setStats({
          total: issues.length || DEMO_ISSUES.length,
          resolved: Math.floor((issues.length || DEMO_ISSUES.length) * 0.4),
          pending: Math.ceil((issues.length || DEMO_ISSUES.length) * 0.6),
        });
      } catch (err) {
        console.error("Failed to load issues from backend:", err);
        setAllIssues(DEMO_ISSUES);
        setStats({
          total: DEMO_ISSUES.length,
          resolved: Math.floor(DEMO_ISSUES.length * 0.4),
          pending: Math.ceil(DEMO_ISSUES.length * 0.6),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Live feed rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex((i) => (i + 1) % LIVE_FEED.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const filtered = filterType === "all" 
    ? allIssues 
    : allIssues.filter((i) => i.type === filterType);

  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#060e1c", overflow: "hidden", fontFamily: "'Rajdhani', sans-serif" }}>
      <Sidebar onLogout={handleLogout} />

      {/* Main map area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        {/* Map grid background + Road lines + Green patches (unchanged) */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(46,204,113,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46,204,113,0.04) 1px, transparent 1px),
            linear-gradient(rgba(52,152,219,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,152,219,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
        }} />

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="rgba(127,140,141,0.15)" strokeWidth="12" />
          <line x1="0" y1="65%" x2="100%" y2="65%" stroke="rgba(127,140,141,0.1)" strokeWidth="8" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(127,140,141,0.12)" strokeWidth="10" />
          <line x1="65%" y1="0" x2="65%" y2="100%" stroke="rgba(127,140,141,0.08)" strokeWidth="6" />
          <line x1="15%" y1="0" x2="50%" y2="100%" stroke="rgba(127,140,141,0.06)" strokeWidth="6" />
          <line x1="70%" y1="0" x2="90%" y2="100%" stroke="rgba(127,140,141,0.05)" strokeWidth="4" />
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="30 20" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="30 20" />
        </svg>

        <div style={{ position: "absolute", left: "47%", top: "40%", width: 120, height: 80, background: "rgba(46,204,113,0.06)", borderRadius: 8, border: "1px solid rgba(46,204,113,0.08)" }} />
        <div style={{ position: "absolute", left: "14%", top: "55%", width: 90, height: 60, background: "rgba(46,204,113,0.05)", borderRadius: 8 }} />

        {/* Issue pins */}
        {filtered.map(issue => (
          <IssuePin
            key={issue.id}
            {...issue}
            issueId={issue.id}
            onUpvoteToggle={updateIssueUpvote}
            onClick={setSelectedPin}
          />
        ))}

        {/* Top bar, Stats bar, Live Feed, Floating buttons (unchanged) */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px",
          background: "rgba(6,14,28,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(46,204,113,0.1)",
          zIndex: 50,
        }}>
          {/* ... your existing top bar code ... */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 14px", width: 240 }}>
            <span style={{ color: "#3a4560", fontSize: 14 }}>🔍</span>
            <input placeholder="Search location..." style={{ background: "none", border: "none", outline: "none", color: "#c8d0e0", fontSize: 13, width: "100%" }} />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {["all", "road", "water", "garbage", "streetlight", "traffic"].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: "5px 12px", borderRadius: 20,
                  border: filterType === t ? "1px solid " + (TYPE_COLORS[t] || "#2ECC71") : "1px solid rgba(255,255,255,0.08)",
                  background: filterType === t ? (TYPE_COLORS[t] || "#2ECC71") + "22" : "rgba(255,255,255,0.03)",
                  color: filterType === t ? (TYPE_COLORS[t] || "#2ECC71") : "#4a5568",
                  fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize"
                }}
              >
                {t === "all" ? "All Issues" : t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#c8d0e0", fontSize: 12, fontWeight: 600 }}>{user.name || "User"}</div>
              <div style={{ color: "#3a4560", fontSize: 10 }}>{user.email || ""}</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #2ECC71, #3498DB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#060e1c", fontWeight: 800, fontSize: 14,
            }}>
              {(user.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, display: "flex", gap: 1, zIndex: 40 }}>
          {[
            { label: "Total Issues", value: stats.total, color: "#3498DB" },
            { label: "Pending", value: stats.pending, color: "#E74C3C" },
            { label: "Resolved", value: stats.resolved, color: "#2ECC71" },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, padding: "8px 16px", background: "rgba(6,14,28,0.75)", backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10
            }}>
              <div style={{ width: 3, height: 28, background: s.color, borderRadius: 2 }} />
              <div>
                <div style={{ color: s.color, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#3a4560", fontSize: 10, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Feed + Floating buttons + Compass (unchanged - keeping original for brevity) */}
        {/* ... your existing Live Feed, Floating buttons, and Compass code ... */}

        {/* Pin detail modal - FIXED */}
        {selectedPin && (
          <div 
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} 
            onClick={() => setSelectedPin(null)}
          >
            <div 
              style={{ 
                background: "rgba(8,16,32,0.98)", 
                border: "1px solid " + (selectedPin.cfg?.color || "#2ECC71") + "44", 
                borderRadius: 16, 
                padding: 28, 
                width: 340, 
                boxShadow: "0 24px 60px rgba(0,0,0,0.7)" 
              }} 
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ color: selectedPin.cfg?.color || "#2ECC71", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                    {selectedPin.cfg?.label || "Issue"}
                  </div>
                  <div style={{ color: "#e8eaf0", fontSize: 20, fontWeight: 700 }}>{selectedPin.title}</div>
                </div>
                <div style={{ fontSize: 32 }}>{selectedPin.cfg?.icon || "📍"}</div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <span style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "4px 10px", color: "#7a8aaa", fontSize: 12 }}>📍 {selectedPin.location}</span>
                {selectedPin.time && <span style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "4px 10px", color: "#7a8aaa", fontSize: 12 }}>🕐 {selectedPin.time}</span>}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <UpvoteButton 
                  issueId={selectedPin.id || selectedPin._id}
                  initialUpvoteCount={selectedPin.upvoteCount || 0}
                  initialUpvoted={selectedPin.userUpvoted || false}
                  onToggle={updateIssueUpvote}
                />
                <button 
                  onClick={() => setSelectedPin(null)} 
                  style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#7a8aaa", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
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
        @keyframes pinPulse { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.4; } 100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; } }
        @keyframes liveBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        * { box-sizing: border-box; }
        input::placeholder { color: #3a4560; }
      `}</style>
    </div>
  );
}