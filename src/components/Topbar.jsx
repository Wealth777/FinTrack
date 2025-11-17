import React, { useEffect, useState } from "react";
import "../styles/components/Topnav.css";
import axios from "axios";
import { FiLogOut, FiBell, FiMoon, FiSun } from 'react-icons/fi'

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function TopNav() {
    // const [darkMode, setDarkMode] = useState(false);
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
                // alert('Signin first')
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

                setUserName(response.data.name)
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
    }, [])

    // const toggleTheme = () => {
    //     setDarkMode(!darkMode);
    //     document.body.classList.toggle("dark");
    // };

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
                // alert("✅ Logged out successfully!");
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
            // console.error(error);
            setError("Logout failed. Please try again later.");
            // alert("Logout failed. Please try again later.");
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


    return (
        <header className="topnav">
            <Toaster position="top-center" />
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
                {/* <button className="theme-toggle" onClick={toggleTheme}>
                    {darkMode ? <FiSun /> : <FiMoon />}
                </button> */}
                {/* <button className="notify-btn"><FiBell /></button> */}
                <button
                    type="button"
                    style={btnStyle}
                    onClick={logout}
                    disabled={loading}
                >
                    {loading ? <FiLogOut /> : <FiLogOut />}
                </button>
            </div>
        </header>
    );
}
