import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { FaPencilAlt, FaLock, FaUserCircle, FaSave, FaRegTimesCircle } from 'react-icons/fa'
import "../styles/pages/Profile.css";
import imgg from '../assets/404 Error Page not Found with people connecting a plug.gif'
import Loader from "../components/Loader";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    profileImage: "",
  });

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const response = await axios.get("https://fintrack-api-9u9p.onrender.com/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setFormData({
        fullName: response.data.name || "",
        email: response.data.email || "",
        profileImage: response.data.profileImage || "",
      });
    } catch (err) {
      toast.error(`Error loading profile: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: { background: "red", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("https://fintrack-api-9u9p.onrender.com/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Profile updated successfully", {
        style: { background: "green", color: "#fff" },
      });
      setModalOpen(false);
      fetchUser();
    } catch (err) {
      toast.error(`Update failed: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: { background: "red", color: "#fff" },
      });
    }
  };

  return (
    <main className="profile-page">
      <Toaster position="top-center" />
      {user ? (
        <div className="profile-container">
          {/* Profile Header Card */}
          <div className="profile-card">
            <div className="profile-header-bg"></div>

            <div className="profile-content">
              <div className="avatar-wrapper">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="Profile"
                  className="profile-avatar"
                />
                <div className="avatar-border"></div>
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{user.name}</h1>

                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>

                <button className="edit-btn" onClick={() => setModalOpen(true)}>
                  <span className="btn-icon"><FaPencilAlt /></span>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon"><FaUserCircle /></div>
              <div className="stat-content">
                <h3>Account Status</h3>
                <p>Active</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><FaLock /></div>
              <div className="stat-content">
                <h3>Privacy</h3>
                <p>Secured</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader/>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Your Profile</h2>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  // required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Picture</label>
                <div className="image-upload-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="upload-label">
                    📸 Choose Image
                  </label>
                  {formData.profileImage && (
                    <div className="preview-wrapper">
                      <img
                        src={formData.profileImage}
                        alt="Preview"
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setModalOpen(false)}
                >
                  <FaRegTimesCircle /> Cancel
                </button>
                <button type="submit" className="save-btn">
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}