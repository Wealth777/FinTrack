import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/pages/budget.css';
import { Toaster, toast } from 'react-hot-toast';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

export default function Budget_Food() {
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
    month: ''
  });


  const token = localStorage.getItem('token');

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://fintrack-api-9u9p.onrender.com/api/budgets',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (Array.isArray(response.data)) {
        const onlyFood = response.data.filter(b => b.category === 'Food');
        setBudgets(onlyFood);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      toast.error(`Error fetching food budgets: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: { background: 'red', color: '#fff' }
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
      category: 'Food',
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

        toast.success('Food budget updated', {
          style: { background: 'green', color: '#fff' }
        }, { duration: 4000 });
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

        toast.success('Food budget added', {
          style: { background: 'green', color: '#fff' }
        }, { duration: 4000 });
      }

      setModalOpen(false);
      setEditBudget(null);
      setFormData({ category: 'Food', limit: '', month: '' });
      fetchBudgets();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Error saving food budget',
        {
          duration: 4000,
          style: { background: 'red', color: '#fff' }
        }
      );
    }
  };

  const handleDelete = async slug => {
    try {
      await axios.delete(
        `https://fintrack-api-9u9p.onrender.com/api/budgets/${slug}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Budget deleted', {
        style: { background: 'green', color: '#fff' }
      });

      fetchBudgets();
    } catch (err) {
      toast.error(`Error deleting budget: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: { background: 'red', color: '#fff' }
      });
    }
  };

  return (
    <>
      <main className="budget-page">
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="budget-head">
              <h1>Food Budget</h1>
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
                      No food budget available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Link to={'/budget'}>
              <button className='btn-editt' >Go to bugets</button>
            </Link>
          </>
        )}

        {modalOpen && (
          <div className="budget-modal">
            <div className="budget-modal-content">
              <h2>{editBudget ? 'Edit Food Budget' : 'Add Food Budget'}</h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="category"
                  value="Food"
                  disabled
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
      </main>
    </>
  );
}