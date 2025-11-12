import React, { useEffect, useState } from 'react';
import '../styles/pages/expences.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Espenses() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ source: '', minAmount: '', maxAmount: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', source: '', date: '', description: '' });

  const token = localStorage.getItem('token')

  const fetchExpenses = async () => {
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
        });
      } else {
        await axios.post(`https://fintrack-api-9u9p.onrender.com/api/expenses`, formData,
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
        });
      }

      fetchExpenses();
      setModalOpen(false);
      setFormData({ title: '', description: '', date: '', source: '', amount: '' })
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
        <p>Are you sure you want to delete this income?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            style={{ background: 'red', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}
            onClick={async () => {
              try {
                await axios.delete(`https://fintrack-api-9u9p.onrender.com/api/expenses/${slug}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.dismiss(t.id);
                toast.success('Income deleted successfully');
                fetchExpenses();
              } catch (err) {
                toast.dismiss(t.id);
                toast.error('Error deleting income');
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


  return (
    <main className="expenses-page">
      <Toaster position='top-center' />
      <section className="expenses-header">
        <h1>Expenses</h1>
        <button className="btn-blue" onClick={() => setModalOpen(true)}>
          Add Expense
        </button>
      </section>

      <section className="expenses-filters">
        <input
          type="text"
          placeholder="Source"
          value={filter.source}
          onChange={e => setFilter({ ...filter, source: e.target.value })}
        />
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
        <button className="btn-blue">Filter</button>
      </section>

      <section className="expenses-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map(expense => (
                <tr key={expense.slug}>
                  <td>{expense.date}</td>
                  <td>{expense.title}</td>
                  <td>{expense.source}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.description}</td>
                  <td>
                    <button className="btn-blue">Edit</button>
                    <button className="btn-blue" onClick={()=> handleDelete(expense.slug)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No expense records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

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
                <button type="button" className="btn-blue" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}