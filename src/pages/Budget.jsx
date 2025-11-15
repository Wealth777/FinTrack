import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/pages/budget.css'
import { Toaster, toast } from 'react-hot-toast'
import { faL } from '@fortawesome/free-solid-svg-icons'

export default function Budget() {
  const [isLoading, setIsLoading] = useState(false)
  const [budgets, setBudgets] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editBudget, setEditBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: '',
  })

  const token = localStorage.getItem('token')

  const fetchBudgets = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        'https://fintrack-api-9u9p.onrender.com/api/budgets',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data && Array.isArray(response.data)) {
        setBudgets(response.data)
      } else {
        setBudgets([])
        toast.error('No budget records found', {
          duration: 4000,
          style: { background: "red", color: "#fff" },
        })
      }
    } catch (err) {
      console.log(err)
      toast.error('Error fetching budgets', {
        duration: 4000,
        style: { background: "red", color: "#fff" },
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const openEditModal = budget => {
    setEditBudget(budget)
    setFormData({
      category: budget.category || '',
      limit: budget.limit || '',
      date: budget.date ? budget.date.slice(0, 10) : '',
    })
    setModalOpen(true)
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const url = editBudget
        ? `https://fintrack-api-9u9p.onrender.com/api/budgets/${editBudget._id}`
        : 'https://fintrack-api-9u9p.onrender.com/api/budgets'

      const method = editBudget ? 'put' : 'post'

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success(editBudget ? 'Budget updated' : 'Budget added', {
        position: "top-center",
        style: { background: "green", color: "#fff" },
      })
      setModalOpen(false)
      setEditBudget(null)
      fetchBudgets()
    } catch (err) {
      toast.error(`Error saving budget: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: { background: "red", color: "#fff" },
      })
    }
  }

  return (
    <main className="budget-page">
      <Toaster />

      {isLoading ? (
        <div className="income-loading-state">
          <div className="income-spinner" />
          <p>Loading incomes...</p>
        </div>
      ) : (
        <>
          <div className="budget-head">
            <h1>Budget Overview</h1>
            <button className='btn-blue' onClick={() => setModalOpen(true)}>Add Budget</button>
          </div>

          <table className="budget-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length > 0 ? budgets.map((b, i) => (
                <tr key={i} onClick={() => openEditModal(b)}>
                  <td>{b.month}</td>
                  <td>{b.category}</td>
                  <td>₦{b.limit}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" id='NoBud'>No budget data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}


      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editBudget ? 'Edit Budget' : 'Create Budget'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="limit"
                placeholder="Limit"
                value={formData.limit}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="btn-blue">{editBudget ? 'Update' : 'Add'}</button>
                <button type="button" className="btn-blue" onClick={() => {
                  setModalOpen(false)
                  setEditBudget(null)
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
