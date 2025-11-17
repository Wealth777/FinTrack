import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/pages/budget.css';
import { Toaster, toast } from 'react-hot-toast';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

export default function Budget() {
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: ''
  });

  const token = localStorage.getItem('token');

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://fintrack-api-9u9p.onrender.com/api/budgets',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(response.data)) {
        setBudgets(response.data);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      toast.error(`Error fetching budgets: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: { background: "red", color: "#fff" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const openEditModal = budget => {
    setEditBudget(budget);
    setFormData({
      category: budget.category,
      limit: budget.limit,
      month: budget.month
    });
    setModalOpen(true);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (editBudget) {
        await axios.put(
          `https://fintrack-api-9u9p.onrender.com/api/budgets/${editBudget.slug}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        toast.success('Budget updated', {
          style: { background: "green", color: "#fff" }
        });
      } else {
        await axios.post(
          'https://fintrack-api-9u9p.onrender.com/api/budgets',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        toast.success('Budget added', {
          style: { background: "green", color: "#fff" }
        });
      }

      setModalOpen(false);
      setEditBudget(null);
      setFormData({ category: '', limit: '', month: '' });
      fetchBudgets();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Error saving budget',
        {
          duration: 4000,
          style: { background: "red", color: "#fff" }
        }
      );
    }
  };

  const handleDelete = slug => {
    toast(t => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p>Delete this budget?</p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{ background: 'red', color: '#fff', padding: '5px 10px' }}
            onClick={async () => {
              try {
                await axios.delete(
                  `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.dismiss(t.id);
                toast.success('Budget deleted');
                fetchBudgets();
              } catch (err) {
                toast.dismiss(t.id);
                toast.error(`Delete failed: ${err.response?.data?.message || err.message}`);
              }
            }}
          >
            Yes
          </button>

          <button
            style={{ background: '#555', color: '#fff', padding: '5px 10px' }}
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <main className="budget-page">
      <Toaster />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="budget-head">
            <h1>Budget Overview</h1>
            <button className="btn-blue" onClick={() => setModalOpen(true)}>
              Add Budget
            </button>
          </div>

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
                  <tr key={i} onClick={() => openEditModal(b)}>
                    <td>{b.month}</td>
                    <td>{b.category}</td>
                    <td>₦{b.limit}</td>

                    <td>
                      <button
                        className="btn-edit"
                        onClick={e => {
                          e.stopPropagation();
                          openEditModal(b);
                        }}
                      >
                        <FaPencilAlt />
                      </button>

                      <button
                        className="btn-edit"
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(b.slug);
                        }}
                      >
                        <FaTrashAlt />
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
        </>
      )}

      {modalOpen && (
        <div className="budget-modal">
          <div className="budget-modal-content">
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
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn-blue">
                  {editBudget ? 'Update' : 'Add'}
                </button>

                <button
                  type="button"
                  className="btn-blue"
                  onClick={() => {
                    setModalOpen(false);
                    setEditBudget(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link to="/budget/food" className="btn-edit">
        <button className="btn-editt">Food Budget</button>
      </Link>

      <Link to="/budget/academics" className="btn-edit">
        <button className="btn-editt">Category Budget</button>
      </Link>
    </main>
  );
}
