import React, { useState } from "react";
import "../../styles/authstyle/Registrer.css";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import registerIllustration from "../../assets/404 Error Page not Found with people connecting a plug.gif";
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const userInfo = {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "https://fintrack-api-9u9p.onrender.com/api/register",
        userInfo
      );

      if (response.status === 200 || response.status === 201) {
        const registerUser = response.data.user
        let newUser = [...users, registerUser];
        setUsers(newUser);
        // console.log("Registered User:", response.data);
        // alert("Registration successful!");
        navigate('/signin')
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again later.");
      }
      // console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <motion.div className="register-all-cont">
        <motion.div
          className="register-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="illustration">
            <motion.img
              src={registerIllustration}
              alt="Register Illustration"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="form-section">
            <h2>FinTrack</h2>
            <h2>Register Now</h2>
            <p>Start tracking your finances easily and smartly.</p>

            {error && <div className="error-box">{error}</div>}

            <form>
              <div className="input-group">
                <FaUser className="icon" />
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <FaLock className="icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="input-group">
                <FaLock className="icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="password_confirmation"
                  placeholder="Confirm Password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye  />}
                </span>
              </div>

              <button
                type="button"
                className="register-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="login-link">
                Already have an account?<Link to={'/signin'}>Sign In</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
