import React, { useEffect, useState } from 'react';
import '../styles/pages/expences.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPencilAlt, FaSearch, FaTrashAlt } from 'react-icons/fa'
import Loader from '../components/Loader';

export default function Espenses() {
  const [isLoading, setIsLoading] = useState(false)
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ source: '', minAmount: '', maxAmount: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', date: '', description: '' });

  const token = localStorage.getItem('token')

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://fintrack-api-9u9p.onrender.com/api/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data && Array.isArray(response.data)) {
        setExpenses(response.data)
      } else {
        setExpenses([]);
        toast.error('No expences records found', {
          duration: 4000,
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
    } catch (err) {
      setExpenses([])
      toast.error(`Failed to load expences: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [])

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      if (editExpense) {
        await axios.put(`https://fintrack-api-9u9p.onrender.com/api/expenses/${editExpense.slug}`, formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        toast.success("Expense updated successfully", {
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        }, { duration: 4000 });
      } else {
        await axios.post(`https://fintrack-api-9u9p.onrender.com/api/expenses`, formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success("Expense added successfully", {
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        }, { duration: 4000 });
      }

      fetchExpenses();
      setModalOpen(false);
      setEditExpense(null)
      setFormData({ title: '', amount: '', date: '', description: '' })
    } catch (err) {
      // console.log(err)
      toast.error(`Error saving expenses: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
    }
  }

  const handleDelete = async (slug) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', }}>
        <p>Are you sure you want to delete this expense?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            style={{ background: 'red', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}
            onClick={async () => {
              try {
                await axios.delete(`https://fintrack-api-9u9p.onrender.com/api/expenses/${slug}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.dismiss(t.id);
                toast.success('Expense deleted successfully', { duration: 4000 });
                fetchExpenses();
              } catch (err) {
                toast.dismiss(t.id);
                toast.error(`Error deleting expense: ${err.response?.data?.message || err.message}`, { duration: 4000 });
              }
            }}
          >
            Yes
          </button>
          <button
            style={{ background: '#555', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };


  const openEditModal = expense => {
    setEditExpense(expense);
    setFormData({
      title: expense.title || '',
      amount: expense.amount || '',
      source: expense.source || '',
      date: expense.date ? expense.date.slice(0, 10) : '',
      description: expense.description || ''
    });
    setModalOpen(true);
  };

  return (
    <main className="expenses-page">
      <Toaster position='top-center' />

      {isLoading ? (
        <Loader/>
      ) : (
        <>
          <section className="expenses-header">
            <h1>Expenses</h1>
            <button className="btn-blue" onClick={() => setModalOpen(true)}>
              Add Expense
            </button>
          </section>

          <section className="expenses-filters">
            {/* <input
              type="text"
              placeholder="Source"
              value={filter.source}
              onChange={e => setFilter({ ...filter, source: e.target.value })}
            /> */}
            <input
              type="number"
              placeholder="Min Amount"
              value={filter.minAmount}
              onChange={e => setFilter({ ...filter, minAmount: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={filter.maxAmount}
              onChange={e => setFilter({ ...filter, maxAmount: e.target.value })}
            />
            <button className="btn-blue"><FaSearch /> Search</button>
          </section>

          <section className="expenses-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map(expense => (
                    <tr key={expense.slug}>
                      <td data-label="Date">{expense.date}</td>
                      <td data-label="Title">{expense.title}</td>
                      <td data-label="Amount">{expense.amount}</td>
                      <td data-label="Description">{expense.description}</td>
                      <td data-label="Actions">
                        <button className="btn-edit" onClick={() => openEditModal(expense)}><FaPencilAlt /></button>
                        <button className="btn-edit" onClick={() => handleDelete(expense.slug)}><FaTrashAlt /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No expense records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editExpense ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="source"
                placeholder="Source"
                value={formData.source}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="btn-blue">{editExpense ? 'Update' : 'Add'}</button>
                <button type="button" className="btn-blue" onClick={() => {
                  setModalOpen(false);
                  setEditExpense(null);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}