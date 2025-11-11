import React, { useEffect, useState } from "react";
import "../styles/components/Topnav.css";
import axios from "axios";
import { FiLogOut, FiBell, FiMoon, FiSun } from 'react-icons/fi'
import { useNavigate } from "react-router-dom";

export default function TopNav() {
    const [darkMode, setDarkMode] = useState(false);
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const [loggedOut, setLoggedOut] = useState(null);

    const navigate = useNavigate()

    const btnStyle = {
        width: "60px",
        maxWidth: '100px',
        padding: "8px",
        background: "none",
        color: "#222",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "1.4rem",
        transition: "background 0.3s ease",
    };


    useEffect(() => {
        const fetchUser = async () => {

            const token = localStorage.getItem('token')

            if (!token) {
                alert('Signin first')
                navigate('/signin')
            }

            try {
                const response = await axios.get(
                    "https://fintrack-api-9u9p.onrender.com/api/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setUserName(response.data.name)
            } catch (error) {
                if (error.response?.status === 401) {
                    setError(alert('Session expired. Please sign in again.'))
                    localStorage.removeItem('token')
                    navigate('/signin')
                } else if (error.response?.data?.message) {
                    setError(alert(error.response.data.message))
                    navigate('/signin')
                } else {
                    setError(alert('Error loading users info'))
                    navigate('/signin')
                }
            }
        }

        fetchUser();
    }, [])

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark");
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                alert("No user logged in!");
                return;
            }

            const response = await axios.post(
                "https://fintrack-api-9u9p.onrender.com/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                // alert("✅ Logged out successfully!");
                localStorage.removeItem("token");
                setLoggedOut(true);
                navigate("/signin");
            }
        } catch {
            // console.error(error);
            setError("Logout failed. Please try again later.");
            // alert("Logout failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <header className="topnav">
            <div className="user-section">
                {/* <img
                    src={usersImg}
                    alt="User"
                    className="user-img"
                /> */}
                <span className="username">{userName}</span>
                {/* <span className="username">{userName}</span> */}
            </div>

            <div className="topnav-actions">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {darkMode ? <FiSun/> : <FiMoon/>}
                </button>
                <button className="notify-btn"><FiBell/></button>
                <button
                    type="button"
                    style={btnStyle}
                    onClick={logout}
                    disabled={loading}
                >
                    {loading ? <FiLogOut /> : <FiLogOut/>}
                </button>
            </div>
        </header>
    );
}
