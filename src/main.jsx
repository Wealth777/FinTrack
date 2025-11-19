import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)


// # 🧠 API Endpoints

// ### 🔑 Authentication
// | Method | Endpoint | Description |
// |--------|-----------|-------------|
// | POST | /api/register | Register new user |
// | POST | /api/login | Login user |
// | POST | /api/logout | Logout authenticated user |
// | GET  | /api/me | Get logged-in user details |

// ### 💸 Income
// | Method | Endpoint | Description |
// |--------|-----------|-------------|
// | GET | /api/incomes | List all incomes |
// | POST | /api/incomes | Create income |
// | GET | /api/incomes/{slug} | View income details |
// | PUT | /api/incomes/{slug} | Update income |
// | DELETE | /api/incomes/{slug} | Delete income |

// ### 💰 Expense
// | Method | Endpoint | Description |
// |--------|-----------|-------------|
// | GET | /api/expenses | List all expenses |
// | POST | /api/expenses | Create expense |
// | GET | /api/expenses/{slug} | View expense details |
// | PUT | /api/expenses/{slug} | Update expense |
// | DELETE | /api/expenses/{slug} | Delete expense |

// ### 📊 Dashboard
// | Method | Endpoint | Description |
// |--------|-----------|-------------|
// | GET | /api/summary | Summary of income & expenses |
// | GET | /api/summary/categories | Summary by category |
// | GET | /api/dashboard | Dashboard overview |
