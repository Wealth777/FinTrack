import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartPie, FaUser, FaMoneyBillWave, FaChartBar,
  FaWallet, FaChartLine, FaBell, FaCog, FaBars, FaTimes
} from "react-icons/fa";
import "../styles/components/Sidenav.css";

export default function SideNav({ isExpanded, setIsExpanded }) {

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsExpanded(false);
    }

    if (window.innerWidth <= 900){
      setIsExpanded(false)
    }
  }, []);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FaChartPie /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
    { name: "Income", path: "/income", icon: <FaMoneyBillWave /> },
    { name: "Budget", path: "/budget", icon: <FaChartBar /> },
    { name: "Expenses", path: "/expenses", icon: <FaWallet /> },
    // { name: "Reports", path: "/report", icon: <FaChartLine /> },
    // { name: "Notifications", path: "/notifications", icon: <FaBell /> },
  ];

  const sidebarVariants = {
    expanded: { width: "230px" },
    collapsed: { width: "80px" },
  };

  return (
    <motion.nav
      className="sidenav"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="nav-header">
        <AnimatePresence>
          {isExpanded && (
            <motion.h2
              className="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              FinTrack
            </motion.h2>
          )}
        </AnimatePresence>

        <button
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <ul className="nav flex-column">
        {links.map((link, index) => (
          <motion.li
            key={index}
            className="nav-item"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              title={!isExpanded ? link.name : ""}
            >
              <span className="icon">{link.icon}</span>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="link-text"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
