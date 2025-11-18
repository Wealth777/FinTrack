import React, { useState } from "react";
import axios from "axios";
import "../../styles/authstyle/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import loginIllustration from "../../assets/react.svg"; // Add your demo illustration

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password!");
      return;
    }

    const user = { email, password };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://fintrack-api-9u9p.onrender.com/api/login",
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // console.log("Logged In:", response.data);

        const { token, user: loggedInUser } = response.data
        localStorage.setItem("token", token);
        setLoggedInUser(loggedInUser);

        // alert("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (error) {
      // console.error("Login Error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Logging in failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div className="login-all-cont">
        <motion.div
          className="login-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* <div className="logpat"></div> */}
          <div className="illustration">

          </div>

          <div className="form-section">
            <h2>Welcome</h2>
            <p>Login to access your account.</p>

            {error && <div className="error-box">{error}</div>}

            <form>
              <div className="input-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <FaLock className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="button"
                className="login-btn"
                onClick={login}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="register-link">
                Don’t have an account? <Link to={'/signup'}>Register</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
