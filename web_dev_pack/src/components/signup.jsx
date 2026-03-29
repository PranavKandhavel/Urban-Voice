import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/login_image.jpg";

function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [hover, setHover] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    if (!name || !email || !password) {
      alert("Enter all the values");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(
      user => user.email.toLowerCase() === email
    );

    if (exists) {
      alert("Email already exists");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify({ name, email, password }));

    navigate("/dashboard");
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
              onFocus={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow =
                  "0px 0px 20px #00f2fe, 0px 0px 40px #4facfe";
              }}
              onBlur={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
              style={{ transition: "all 0.3s ease" }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow =
                  "0px 0px 20px #00f2fe, 0px 0px 40px #4facfe";
              }}
              onBlur={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
              style={{ transition: "all 0.3s ease" }}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow =
                  "0px 0px 20px #00f2fe, 0px 0px 40px #4facfe";
              }}
              onBlur={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
              style={{ transition: "all 0.3s ease" }}
            />

            <button
              className="btn w-100"
              style={{
                background: "linear-gradient(90deg,#4facfe,#00f2fe)",
                border: "none",
                color: "white",
                fontWeight: "bold"
              }}
            >
              SIGNUP
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
