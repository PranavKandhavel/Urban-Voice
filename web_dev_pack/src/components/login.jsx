import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import bg from "../assets/login_image.jpg";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (error) setError("");
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    try {
      const res = await API.post("/auth/login", {
        email: data.email.trim().toLowerCase(),
        password: data.password.trim()
      });
 
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user || res.data));
      navigate("/dashboard");
 
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh"
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "440px",
          height: "440px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,#4facfe,#00f2fe,#667eea,#764ba2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: hover ? "0px 0px 80px rgba(0,200,255,1)" : "0px 0px 60px rgba(0,200,255,0.8)",
          transform: hover ? "scale(1.05)" : "scale(1)",
          transition: "all 0.5s"
        }}
      >
        <div style={{
          width: "410px",
          height: "410px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(15px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: "36px"
        }}>
          <h3 style={{ marginBottom: 6, fontWeight: 800 }}>Urban Voice</h3>
          <h5 style={{ marginBottom: 16, opacity: 0.7, fontWeight: 400, fontSize: 14 }}>Sign in to your account</h5>
 
          {error && (
            <div style={{
              background: "rgba(231,76,60,0.18)", border: "1px solid rgba(231,76,60,0.4)",
              color: "#ff8a80", borderRadius: 8, padding: "8px 14px",
              fontSize: 12, marginBottom: 12, width: "80%", textAlign: "center",
            }}>
              ⚠️ {error}
            </div>
          )}
 
          <form onSubmit={handleSubmit} style={{ width: "80%" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              onChange={handleChange}
              required
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
            />
 
            {/* Password with eye icon */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-control"
                onChange={handleChange}
                required
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  paddingRight: 44,
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer",
                  fontSize: 17, padding: 0, lineHeight: 1,
                  transition: "color 0.2s",
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
 
            <button
              className="btn w-100"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg,#4facfe,#00f2fe)",
                border: "none",
                color: "white",
                fontWeight: "bold",
                padding: "10px",
                borderRadius: 8,
              }}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
 
          <p style={{ marginTop: 14, fontSize: "13px" }}>
            New user?{" "}
            <Link to="/signup" style={{ color: "#00f2fe" }}>
              Signup
            </Link>
          </p>
        </div>
      </div>
 
      <style>{`
        .form-control::placeholder { color: rgba(255,255,255,0.4) !important; }
        .form-control:focus { background: rgba(255,255,255,0.12) !important; border-color: rgba(0,200,255,0.5) !important; box-shadow: none !important; color: white !important; }
      `}</style>
    </div>
  );
}
 
export default Login;
