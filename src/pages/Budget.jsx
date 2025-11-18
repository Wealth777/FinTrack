import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/pages/budget.css'
import { Toaster, toast } from 'react-hot-toast'
import { FaPencilAlt, FaTrashAlt, FaPlus } from 'react-icons/fa'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'

export default function Budget() {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editBudget, setEditBudget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: ''
  })

  const token = localStorage.getItem('token')

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        'https://fintrack-api-9u9p.onrender.com/api/categories',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCategories(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  const fetchBudgets = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        'https://fintrack-api-9u9p.onrender.com/api/budgets',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBudgets(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchBudgets()
  }, [])

  const openCreateModal = () => {
    setEditBudget(null)
    setFormData({ category: '', limit: '', month: '' })
    setModalOpen(true)
  }

  const openEditModal = budget => {
    setEditBudget(budget)
    setFormData({
      category: budget.category || '',
      limit: formatNumberForInput(budget.limit),
      month: budget.month || ''
    })
    setModalOpen(true)
  }

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'limit') {
      const cleaned = value.replace(/[^0-9.,]/g, '')
      setFormData({ ...formData, [name]: cleaned })
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  const parseToNumber = input => {
    if (input === undefined || input === null || input === '') return 0
    const normalized = input.replace(/[, ]+/g, '').replace(/,/g, '')
    const num = Number(normalized)
    return Number.isFinite(num) ? num : 0
  }

  function formatNumberForInput(value) {
    if (value === undefined || value === null || value === '') return ''
    const num = Number(value)
    if (!Number.isFinite(num)) return ''
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  const validateForm = () => {
    if (!formData.category || formData.category.trim() === '') {
      toast.error('Select a category')
      return false
    }
    const limitNumber = parseToNumber(formData.limit)
    if (!limitNumber || limitNumber <= 0) {
      toast.error('Enter a valid limit bigger than 0')
      return false
    }
    if (!formData.month || formData.month.trim() === '') {
      toast.error('Select a month')
      return false
    }
    const duplicate = budgets.find(b => {
      if (editBudget && b.slug === editBudget.slug) return false
      return b.category === formData.category && b.month === formData.month
    })
    if (duplicate) {
      toast.error('A budget for this category and month already exists')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = {
      category: formData.category,
      limit: parseToNumber(formData.limit),
      month: formData.month
    }

    try {
      setSubmitting(true)
      if (editBudget) {
        await axios.put(
          `https://fintrack-api-9u9p.onrender.com/api/budgets/${editBudget.slug}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        toast.success('Budget updated')
      } else {
        await axios.post(
          'https://fintrack-api-9u9p.onrender.com/api/budgets',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        toast.success('Budget added', { duration: 4000 })
      }
      setModalOpen(false)
      setEditBudget(null)
      setFormData({ category: '', limit: '', month: '' })
      fetchBudgets()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }


  }

  const confirmDelete = slug => {
    toast(t => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p>Delete this budget</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{ background: 'red', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: 6 }}
            onClick={async () => {
              try {
                await axios.delete(
                  `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                toast.dismiss(t.id)
                toast.success('Budget deleted', { duration: 4000, })
                fetchBudgets()
              } catch (err) {
                toast.dismiss(t.id)
                toast.error(err.response?.data?.message || err.message)
              }
            }}
          >
            Yes
          </button>

          <button
            style={{ background: '#555', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: 6 }}
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div >
    ))


  }

  return (
    <main className="budget-page">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="budget-head">
            <h1>Budget Overview</h1>
            <div className="head-actions">
              <button className="btn-blue" onClick={openCreateModal}>
                <FaPlus style={{ marginRight: 8 }} />
                Add Budget
              </button>
            </div>
          </div>

          <div className="budget-list-wrap">
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Category</th>
                  <th>Limit</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {budgets.length > 0 ? (
                  budgets.map((b, i) => (
                    <tr key={i} className="budget-row">
                      <td data-label="Month">
                        <div className="card-title">{b.month}</div>
                      </td>
                      <td data-label="Details">
                        <div className="card-description">{b.category}</div>
                      </td>
                      <td data-label="Amount">
                        <div className="card-amount">₦{formatNumberForInput(b.limit)}</div>
                      </td>
                      <td className="actions-td" data-label="Actions">
                        <button
                          className="icon-btn"
                          onClick={() => openEditModal(b)}
                          title="Edit"
                        >
                          <FaPencilAlt color='#2563eb' />
                        </button>

                        <button
                          className="icon-btn"
                          onClick={() => confirmDelete(b.slug)}
                          title="Delete"
                        >
                          <FaTrashAlt color="red" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" id="NoBud">
                      No budget data available
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
            <div className="quick-links">
              <Link to="/budget/food" className="btn-link">Food Budget</Link>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <div className="budget-modal">
          <div className="budget-modal-content">
            <div className="modal-header">
              <h2>{editBudget ? 'Edit Budget' : 'Create Budget'}</h2>
              <button className="close-btn" onClick={() => { setModalOpen(false); setEditBudget(null) }}>
                x
              </button>
            </div>

            <form onSubmit={handleSubmit} className="budget-form">
              <label>
                Category
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c, idx) => (
                    <option key={idx} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Limit
                <input
                  name="limit"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9,]*"
                  value={formData.limit}
                  onChange={handleChange}
                  onBlur={e => {
                    const n = parseToNumber(e.target.value)
                    const formatted = n ? new Intl.NumberFormat('en-US').format(n) : ''
                    setFormData(prev => ({ ...prev, limit: formatted }))
                  }}
                  onFocus={e => {
                    // show raw number while editing
                    const n = parseToNumber(e.target.value)
                    setFormData(prev => ({ ...prev, limit: n ? String(n) : '' }))
                  }}
                  placeholder="0"
                  required
                />
              </label>

              <label>
                Month
                <input
                  name="month"
                  type="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn-blue" disabled={submitting}>
                  {submitting ? (editBudget ? 'Updating...' : 'Saving...') : (editBudget ? 'Update' : 'Add')}
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setModalOpen(false)
                    setEditBudget(null)
                    setFormData({ category: '', limit: '', month: '' })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>


  )
}