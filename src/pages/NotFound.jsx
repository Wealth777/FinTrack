import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '../styles/pages/404.css'
import { FaHome } from 'react-icons/fa'
import logo from '../assets/404 Error Page not Found with people connecting a plug.gif'
import storysetImg from '../assets/404 Error Page not Found with people connecting a plug.gif'
import { Link } from 'react-router-dom'

export default function NotFound() {
useEffect(() => {
AOS.init()
}, [])

return (
<div className="err-container">
<div className="err-box" data-aos="zoom-in">
<img src={logo} alt="FinTrack logo" className="err-logo" data-aos="fade-up" />

    <img src={storysetImg} alt="Illustration" className="err-illustration" data-aos="fade-up" />

    <h1 className="err-title" data-aos="fade-up">Page not found</h1>
    <p className="err-text" data-aos="fade-up">
      The page you are looking for does not exist or has been removed.
    </p>
{/* 
    <a href="/" >
      
    </a> */}

    <Link to={'/signin'} className="err-btn" data-aos="fade-up">
      <FaHome />
      Go home
    </Link>
  </div>
</div>


)
}