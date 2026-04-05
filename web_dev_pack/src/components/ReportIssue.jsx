import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import API from "../api";

const ISSUE_TYPES = [
  { value: "road",        label: "Road Damage",   icon: "🛣️", color: "#E74C3C" },
  { value: "water",       label: "Water Leakage", icon: "🚰", color: "#3498DB" },
  { value: "garbage",     label: "Garbage",       icon: "🗑️", color: "#2ECC71" },
  { value: "streetlight", label: "Streetlight",   icon: "💡", color: "#F1C40F" },
  { value: "traffic",     label: "Traffic",       icon: "🚦", color: "#E67E22" },
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [pinPlaced, setPinPlaced] = useState(null);
  const [form, setForm] = useState({ type: "", title: "", location: "", description: "", image: null });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPlaced({ x, y });
    const areas = ["Gandhipuram", "Peelamedu", "RS Puram", "Saibaba Colony", "Hopes College", "Singanallur", "Race Course"];
    const auto = areas[Math.floor(Math.random() * areas.length)];
    setForm(f => ({ ...f, location: auto }));
  };

  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Select issue type";
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.location.trim()) e.location = "Pin a location on the map";
    if (!pinPlaced) e.location = "Click on the map to pin location";
    return e;
  };

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  const formData = new FormData();
  formData.append("title", form.title.trim());
  formData.append("description", form.description || "");
  formData.append("category", form.type === "road" ? "Roads" : 
    form.type === "water" ? "Water" : 
    form.type === "garbage" ? "Garbage" : 
    form.type === "streetlight" ? "Streetlight" : "Other");
  formData.append("address", form.location.trim());
  
  // Generate coords for Coimbatore area from pin (lat ~10.99, long ~76.96)
  const lat = 10.99 + (pinPlaced.y / 1000);
  const lng = 76.96 + (pinPlaced.x / 1000);
  formData.append("latitude", lat);
  formData.append("longitude", lng);

  if (form.image) {
    formData.append("photo", form.image);
  }

  try {
    await API.post("/api/issues", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setSubmitted(true);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to submit issue");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#060e1c", fontFamily: "'Rajdhani', sans-serif" }}>
        <Sidebar onLogout={handleLogout} />
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 20,
        }}>
          <div style={{ fontSize: 64, animation: "bounce 0.5s ease" }}>✅</div>
          <div style={{ color: "#2ECC71", fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>Issue Reported!</div>
          <div style={{ color: "#5a6a88", fontSize: 14, textAlign: "center" }}>
            Your complaint has been submitted.<br />Our team will act on it shortly.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "10px 24px", borderRadius: 8,
                background: "linear-gradient(135deg, #2ECC71, #27ae60)",
                border: "none", color: "#060e1c", fontWeight: 800,
                cursor: "pointer", fontSize: 13,
              }}
            >
              Back to Map
            </button>
            <button
              onClick={() => navigate("/my-complaints")}
              style={{
                padding: "10px 24px", borderRadius: 8,
                background: "rgba(52,152,219,0.15)",
                border: "1px solid rgba(52,152,219,0.35)",
                color: "#3498DB", fontWeight: 700, cursor: "pointer", fontSize: 13,
              }}
            >
              My Reports
            </button>
          </div>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;800&display=swap');
          @keyframes bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        `}</style>
      </div>
    );
  }

  const selectedType = ISSUE_TYPES.find(t => t.value === form.type);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#060e1c", fontFamily: "'Rajdhani', sans-serif" }}>
      <Sidebar onLogout={handleLogout} />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Map half */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
              linear-gradient(rgba(46,204,113,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(46,204,113,0.05) 1px, transparent 1px),
              linear-gradient(rgba(52,152,219,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52,152,219,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
          }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(127,140,141,0.15)" strokeWidth="10" />
            <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(127,140,141,0.1)" strokeWidth="7" />
            <line x1="35%" y1="0" x2="35%" y2="100%" stroke="rgba(127,140,141,0.12)" strokeWidth="8" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(127,140,141,0.08)" strokeWidth="5" />
          </svg>

          {/* Clickable map */}
          <div
            style={{
              position: "absolute", inset: 0,
              cursor: pinPlaced ? "crosshair" : "pointer",
            }}
            onClick={handleMapClick}
          >
            {/* Instruction overlay */}
            {!pinPlaced && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center", pointerEvents: "none",
              }}>
                <div style={{ fontSize: 48, marginBottom: 12, animation: "bounce 1.5s ease-in-out infinite" }}>📍</div>
                <div style={{ color: "#3a4560", fontSize: 16, fontWeight: 600 }}>Click anywhere to pin location</div>
              </div>
            )}

            {/* Placed pin */}
            {pinPlaced && (
              <div style={{
                position: "absolute",
                left: pinPlaced.x + "%",
                top: pinPlaced.y + "%",
                transform: "translate(-50%, -100%)",
                pointerEvents: "none",
              }}>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 50, height: 50, borderRadius: "50%",
                  background: selectedType ? selectedType.color : "#2ECC71",
                  opacity: 0.2, animation: "pinPulse 1.5s ease-out infinite",
                }} />
                <div style={{
                  width: 40, height: 40,
                  borderRadius: "50% 50% 50% 0",
                  background: selectedType ? selectedType.color : "#2ECC71",
                  transform: "rotate(-45deg)",
                  boxShadow: "0 4px 20px " + (selectedType ? selectedType.color : "#2ECC71") + "88",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ transform: "rotate(45deg)", fontSize: 18 }}>
                    {selectedType ? selectedType.icon : "📍"}
                  </span>
                </div>
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(8,16,32,0.9)",
                  border: "1px solid rgba(46,204,113,0.2)",
                  borderRadius: 6, padding: "4px 10px",
                  color: "#2ECC71", fontSize: 11, fontWeight: 600,
                  whiteSpace: "nowrap",
                }}>
                  {form.location || "Location pinned"}
                </div>
              </div>
            )}
          </div>

          {/* Instruction badge */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            background: "rgba(6,14,28,0.9)",
            border: "1px solid rgba(46,204,113,0.2)",
            borderRadius: 8, padding: "8px 14px",
            color: "#5a8a70", fontSize: 12,
          }}>
            {pinPlaced ? `✅ Location pinned · Click to move` : "👆 Click map to pin your location"}
          </div>
        </div>

        {/* Form panel */}
        <div style={{
          width: 380,
          background: "rgba(8,16,32,0.97)",
          borderLeft: "1px solid rgba(46,204,113,0.1)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "none", border: "none", color: "#3a4560",
                fontSize: 12, cursor: "pointer", marginBottom: 12,
                display: "flex", alignItems: "center", gap: 4, padding: 0,
              }}
            >
              ‹ Back to Map
            </button>
            <div style={{ color: "#e8eaf0", fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>Report Issue</div>
            <div style={{ color: "#3a4560", fontSize: 12, marginTop: 3 }}>Pin location on map, then fill details</div>
          </div>

          {/* Form body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

            {/* Issue type */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#5a6a88", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Issue Type {errors.type && <span style={{ color: "#E74C3C", marginLeft: 6 }}>{errors.type}</span>}
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ISSUE_TYPES.map(t => (
                  <div
                    key={t.value}
                    onClick={() => { setForm(f => ({ ...f, type: t.value })); setErrors(e => ({ ...e, type: "" })); }}
                    style={{
                      padding: "10px 12px",
                      border: form.type === t.value ? "1px solid " + t.color : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10,
                      background: form.type === t.value ? t.color + "18" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span style={{ color: form.type === t.value ? t.color : "#5a6a88", fontSize: 12, fontWeight: 600 }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#5a6a88", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Title {errors.title && <span style={{ color: "#E74C3C", marginLeft: 6 }}>{errors.title}</span>}
              </label>
              <input
                placeholder="Brief issue title..."
                value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(e2 => ({ ...e2, title: "" })); }}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: errors.title ? "1px solid #E74C3C" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e8eaf0", fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#5a6a88", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Location {errors.location && <span style={{ color: "#E74C3C", marginLeft: 6 }}>{errors.location}</span>}
              </label>
              <input
                placeholder="Pin on map to auto-fill, or type..."
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: errors.location ? "1px solid #E74C3C" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e8eaf0", fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#5a6a88", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e8eaf0", fontSize: 13,
                  outline: "none", resize: "none",
                }}
              />
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#5a6a88", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Upload Photo (optional)
              </label>
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 6,
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "20px",
                cursor: "pointer",
                background: form.image ? "rgba(46,204,113,0.06)" : "rgba(255,255,255,0.02)",
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 24 }}>{form.image ? "✅" : "📷"}</span>
                <span style={{ color: "#3a4560", fontSize: 12 }}>
                  {form.image ? form.image.name : "Click to upload image"}
                </span>
                <input
                  type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #2ECC71, #27ae60)",
                border: "none", borderRadius: 10,
                color: "#060e1c", fontWeight: 800, fontSize: 14,
                cursor: "pointer", letterSpacing: 0.5,
                boxShadow: "0 4px 20px rgba(46,204,113,0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;800&display=swap');
        @keyframes pinPulse { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.4; } 100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        * { box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: #2a3550; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(46,204,113,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
