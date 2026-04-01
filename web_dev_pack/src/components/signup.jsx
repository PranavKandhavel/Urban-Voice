import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import bg from "../assets/login_image.jpg";

function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await API.post("/api/auth/register", {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password.trim()
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("loggedInUser", JSON.stringify(res.data.user || res.data));

    alert("Account created successfully!");
    navigate("/dashboard");

  } catch (err) {
    alert(err.response?.data?.message || "Signup failed. Try again.");
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
          boxShadow: hover
            ? "0px 0px 80px rgba(0,200,255,1)"
            : "0px 0px 60px rgba(0,200,255,0.8)",
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
          <h5 className="mb-3">Signup</h5>

          <form onSubmit={handleSubmit} style={{ width: "80%" }}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="form-control mb-2"
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
              {loading ? "Creating account..." : "SIGNUP"}
            </button>
          </form>

          <p className="mt-2" style={{ fontSize: "14px" }}>
            Already user?{" "}
            <Link to="/login" style={{ color: "#00f2fe" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
