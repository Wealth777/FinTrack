import React, {useState} from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Transactions from './pages/Transactions'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import SideNav from './components/Sidebar'
import TopNav from './components/Topbar'
import Income from './pages/Income'
import Espenses from './pages/Espenses'
import Profile from './pages/Profile'

function App() {

  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path='/signin' element={<Login />} />
      <Route path='/signup' element={<Register />} />
      <Route path='/forgetpassword' element={<ForgotPassword />} />

      {/* Dashboard Layout Route */}
      <Route
        path='/*'
        element={
          <div className="layout">
            <SideNav isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <div 
              className="main-content"
              style={{
                marginLeft: isExpanded ? '240px' : '90px',
                transition: 'margin-left 0.9s ease',
              }}
            >
              <TopNav />
              <div className="page-content">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="income" element={<Income />} />
                  <Route path="budget" element={<Budget />} />
                  <Route path="expenses" element={<Espenses />} />
                  <Route path="report" element={<Reports />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
