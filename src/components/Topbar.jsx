import React, { useEffect, useState, useContext } from "react";
import "../styles/components/Topnav.css";
import axios from "axios";
import { FiLogOut, FiBell, FiMoon, FiSun } from 'react-icons/fi'
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";

export default function TopNav() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const [loggedOut, setLoggedOut] = useState(null);

    const navigate = useNavigate()

    // const btnStyle = {
    //     width: "auto",
    //     minWidth: "44px",
    //     padding: "8px 10px",
    //     background: "transparent",
    //     color: "currentColor",
    //     border: "1px solid var(--border-color)",
    //     borderRadius: "6px",
    //     cursor: "pointer",
    //     fontSize: "1.2rem",
    //     transition: "all 0.3s ease",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center"
    // };


    useEffect(() => {
        const fetchUser = async () => {

            const token = localStorage.getItem('token')

            if (!token) {
                toast.error('Signin First', {
                    position: "top-center",
                    style: {
                        background: "red",
                        color: "#fff",
                    },
                });
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

                setUser(response.data)
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Session expired. Please sign in again.')
                    localStorage.removeItem('token')
                    toast.error('Session expired. Please sign in again.', {
                        position: "top-center",
                        style: {
                            background: "red",
                            color: "#fff",
                        },
                    });
                    navigate('/signin')
                } else if (error.response?.data?.message) {
                    setError(error.response.data.message)
                    toast.error(error.response.data.message, {
                        position: "top-center",
                        style: {
                            background: "red",
                            color: "#fff",
                        },
                    });
                    navigate('/signin')
                } else {
                    setError('Error loading users info')
                    toast.error('Error loading users info', {
                        position: "top-center",
                        style: {
                            background: "red",
                            color: "#fff",
                        },
                    });
                    navigate('/signin')
                }
            }
        }

        fetchUser();
    }, [navigate])


    const logout = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                alert();
                toast.error("No user logged in!", {
                    position: "top-center",
                    style: {
                        background: "red",
                        color: "#fff",
                    },
                });
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
                localStorage.removeItem("token");
                setLoggedOut(true);
                toast.success('Logged out successfully!', {
                    position: "top-center",
                    style: {
                        background: "green",
                        color: "#fff",
                    },
                });
                navigate("/signin");
            }
        } catch {
            setError("Logout failed. Please try again later.");
            toast.error('Logout failed. Please try again later.', {
                position: "top-center",
                style: {
                    background: "green",
                    color: "#fff",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    function getInitial(name) {
        if (!name) return "";
        return name.trim().charAt(0).toUpperCase();
    }


    return (
        <header className="topnav">
            <Toaster position="top-center" />
            <div className="user-section">
                {/* <img
                    src={usersImg}
                    alt="User"
                    className="user-img"
                /> */}
                {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="topnav-profile-avatar" />
                ) : (

                    <div className="topnav-auto-avatar"> {getInitial(user.name)} </div>)} <div className="topnav-avatar-border"></div>
                <span className="username">{user.name}</span>
            </div>

            <div className="topnav-actions">
                <button
                    className="theme-toggle"
                    onClick={() => {
                        // console.log('🖱️ Theme toggle button clicked!')
                        toggleTheme()
                    }}
                    title="Toggle dark/light theme"
                >
                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>

                <button
                    type="button"
                    className="btnStylelog"
                    onClick={logout}
                    disabled={loading}
                >
                    {loading ? <FiLogOut /> : <FiLogOut />}
                </button>
            </div>
        </header>
    );
}
