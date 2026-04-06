import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import API from "../api"
import { useTheme } from "../ThemeContext";;
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ISSUE_TYPES = [
  { value: "road",        label: "Road Damage",   icon: "🛣️", color: "#E74C3C" },
  { value: "water",       label: "Water Leakage", icon: "🚰", color: "#3498DB" },
  { value: "garbage",     label: "Garbage",       icon: "🗑️", color: "#2ECC71" },
  { value: "streetlight", label: "Streetlight",   icon: "💡", color: "#F1C40F" },
  { value: "other",       label: "Other",         icon: "❓", color: "#95A5A6" },
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  
  // Guard for authorities
  if (user.role === "authority") {
    return <Navigate to="/my-complaints" replace />;
  }

  const [pinPlaced, setPinPlaced] = useState(null);
  const [form, setForm] = useState({ type: "", title: "", location: "", description: "", image: null });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Handled by MapEvents component now
  const handleMapClick = async (latlng) => {
    setPinPlaced({ lat: latlng.lat, lng: latlng.lng });
    setForm(f => ({ ...f, location: "Locating..." }));
    
    try {
      // Reverse Geocoding using OpenStreetMap Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await res.json();
      // Use neighborhood or road if available, else just display the name
      const place = data.address?.neighbourhood || data.address?.road || data.address?.suburb || data.display_name.split(",")[0];
      setForm(f => ({ ...f, location: place }));
    } catch (err) {
      console.error("Failed to reverse geocode:", err);
      // Fallback
      setForm(f => ({ ...f, location: "Coimbatore Location" }));
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      }
    });
    return null;
  }

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
    form.type === "streetlight" ? "Streetlight" : 
    form.type === "other" ? "Other" : "Other");
  formData.append("address", form.location.trim());
  
  // Use real coords
  const lat = pinPlaced.lat;
  const lng = pinPlaced.lng;
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
    setErrors({ submit: err.response?.data?.message || "Failed to submit issue" });
  }
};

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", background: t.bg, fontFamily: "'Rajdhani', sans-serif" }}>
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

  const selectedType = ISSUE_TYPES.find(type => type.value === form.type);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: t.bg, fontFamily: "'Rajdhani', sans-serif" }}>
      <Sidebar onLogout={handleLogout} />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Map half */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          
          <MapContainer 
            center={[11.0168, 76.9558]} 
            zoom={13} 
            style={{ position: 'absolute', inset: 0, zIndex: 10, width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url={theme.bg === "#f0f4f8" ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
              attribution='&copy; OpenStreetMap contributors & CartoDB'
            />
            <MapClickHandler />

            {pinPlaced && (
               <CircleMarker
                 center={[pinPlaced.lat, pinPlaced.lng]}
                 radius={12}
                 pathOptions={{ 
                   color: selectedType ? selectedType.color : "#2ECC71", 
                   fillColor: selectedType ? selectedType.color : "#2ECC71", 
                   fillOpacity: 0.8, 
                   weight: 3 
                 }}
               />
            )}
          </MapContainer>

          {/* Instruction overlay */}
          {!pinPlaced && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center", pointerEvents: "none", zIndex: 20
            }}>
              <div style={{ fontSize: 48, marginBottom: 12, animation: "bounce 1.5s ease-in-out infinite" }}>📍</div>
              <div style={{ color: theme.textMuted, fontSize: 16, fontWeight: 600 }}>Click anywhere on the map to pin</div>
            </div>
          )}

          {/* Instruction badge */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            background: theme.bgPanel,
            border: `1px solid ${theme.borderGreen}`,
            borderRadius: 8, padding: "8px 14px",
            color: theme.textMuted, fontSize: 12, zIndex: 20
          }}>
            {pinPlaced ? `✅ Location pinned · Click to move` : "👆 Click map to pin your location"}
          </div>
        </div>

        {/* Form panel */}
        <div style={{
          width: 380,
          background: theme.bgPanel,
          borderLeft: `1px solid ${theme.borderGreen}`,
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
                background: "none", border: "none", color: theme.textDim,
                fontSize: 12, cursor: "pointer", marginBottom: 12,
                display: "flex", alignItems: "center", gap: 4, padding: 0,
              }}
            >
              ‹ Back to Map
            </button>
            <div style={{ color: theme.textPrimary, fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>Report Issue</div>
            <div style={{ color: theme.textDim, fontSize: 12, marginTop: 3 }}>Pin location on map, then fill details</div>
          </div>

          {/* Form body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

            {/* Issue type */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Issue Type {errors.type && <span style={{ color: "#E74C3C", marginLeft: 6 }}>{errors.type}</span>}
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ISSUE_TYPES.map(t => (
                  <div
                    key={theme.value}
                    onClick={() => { setForm(f => ({ ...f, type: theme.value })); setErrors(e => ({ ...e, type: "" })); }}
                    style={{
                      padding: "10px 12px",
                      border: form.type === theme.value ? "1px solid " + theme.color : `1px solid ${theme.border}`,
                      borderRadius: 10,
                      background: form.type === theme.value ? theme.color + "18" : theme.bgCard,
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{theme.icon}</span>
                    <span style={{ color: form.type === theme.value ? theme.color : theme.textMuted, fontSize: 12, fontWeight: 600 }}>{theme.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Title {errors.title && <span style={{ color: "#E74C3C", marginLeft: 6 }}>{errors.title}</span>}
              </label>
              <input
                placeholder="Brief issue title..."
                value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.targetheme.value })); setErrors(e2 => ({ ...e2, title: "" })); }}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: theme.bgCard,
                  border: errors.title ? "1px solid #E74C3C" : `1px solid ${theme.border}`,
                  borderRadius: 8, color: theme.textPrimary, fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Location {errors.location && <span style={{ color: "#E74C3C", marginLeft: 6 }}>{errors.location}</span>}
              </label>
              <input
                placeholder="Pin on map to auto-fill, or type..."
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.targetheme.value }))}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: theme.bgCard,
                  border: errors.location ? "1px solid #E74C3C" : `1px solid ${theme.border}`,
                  borderRadius: 8, color: theme.textPrimary, fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.targetheme.value }))}
                rows={3}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8, color: theme.textPrimary, fontSize: 13,
                  outline: "none", resize: "none",
                }}
              />
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Upload Photo (optional)
              </label>
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 6,
                border: `1px dashed ${theme.border}`,
                borderRadius: 8, padding: "20px",
                cursor: "pointer",
                background: form.image ? "rgba(46,204,113,0.06)" : theme.bgCard,
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 24 }}>{form.image ? "✅" : "📷"}</span>
                <span style={{ color: theme.textDim, fontSize: 12 }}>
                  {form.image ? form.image.name : "Click to upload image"}
                </span>
                <input
                  type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => setForm(f => ({ ...f, image: e.targetheme.files[0] }))}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${theme.border}` }}>
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
              onMouseEnter={e => e.currentTargetheme.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTargetheme.style.transform = "translateY(0)"}
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
        textarea::placeholder, input::placeholder { color: ${theme.textDim}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(46,204,113,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
