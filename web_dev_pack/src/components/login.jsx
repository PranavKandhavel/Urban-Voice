import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import bg from "../assets/login_image.jpg";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Most common mounting for auth routes
      const res = await API.post("/api/auth/login", {
        email: data.email.trim().toLowerCase(),
        password: data.password.trim()
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user || res.data));

      alert("✅ Login Successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid email or password. Please check your credentials.");
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
          width: "420px",
          height: "420px",
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
          width: "390px",
          height: "390px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(15px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: "30px"
        }}>
          <h3 className="mb-3">Urban Voice</h3>
          <h5 className="mb-3">Login</h5>

          <form onSubmit={handleSubmit} style={{ width: "80%" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              onChange={handleChange}
              required
            />
            <button
              className="btn w-100"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg,#4facfe,#00f2fe)",
                border: "none",
                color: "white",
                fontWeight: "bold"
              }}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="mt-3" style={{ fontSize: "14px" }}>
            New user?{" "}
            <Link to="/signup" style={{ color: "#00f2fe" }}>
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;