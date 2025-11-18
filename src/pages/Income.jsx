import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { FaPencilAlt, FaSearch, FaTrashAlt } from 'react-icons/fa'
import '../styles/pages/income.css';
import { toast, Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';

export default function Income() {
  const [isLoading, setIsLoading] = useState(true);
  const [originalIncomes, setOriginalIncomes] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [filter, setFilter] = useState({ source: '', minAmount: '', maxAmount: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editIncome, setEditIncome] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: '',
    date: '',
    description: ''
  });

  const token = localStorage.getItem('token');


  const fetchIncomes = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://fintrack-api-9u9p.onrender.com/api/incomes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setIncomes(response.data);
        setOriginalIncomes(response.data);
      } else {
        // console.error('Unexpected response:', response.data);
        setIncomes([]);
        setOriginalIncomes([]);
        toast.error('No income records found', {
          duration: 4000,
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
    } catch (err) {
      // console.error('Error fetching incomes:', err);
      setIncomes([]);
      toast.error(`Failed to load incomes: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false)
    }
  }, [token]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);


  const handleFilter = () => {
    // Always filter from the original full list to avoid cumulative filters
    let filtered = Array.isArray(originalIncomes) ? [...originalIncomes] : [];
    if (filter.source) filtered = filtered.filter(i => (i.source || '').toLowerCase().includes(filter.source.toLowerCase()));
    if (filter.minAmount) filtered = filtered.filter(i => Number(i.amount) >= Number(filter.minAmount));
    if (filter.maxAmount) filtered = filtered.filter(i => Number(i.amount) <= Number(filter.maxAmount));
    setIncomes(filtered);
  };

  const resetFilter = () => {
    setFilter({ source: '', minAmount: '', maxAmount: '' });
    setIncomes(originalIncomes || []);
  };


  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (editIncome) {
        await axios.put(
          `https://fintrack-api-9u9p.onrender.com/api/incomes/${editIncome.slug}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success("Income updated successfully", {
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        }, { duration: 4000 });
      } else {
        await axios.post('https://fintrack-api-9u9p.onrender.com/api/incomes', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success("Income added successfully", {
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        }, { duration: 4000 });
      }

      fetchIncomes();
      setModalOpen(false);
      setEditIncome(null);
      setFormData({ title: '', amount: '', source: '', date: '', description: '' });
    } catch (err) {
      // console.error('Error saving income:', err);
      toast.error(`Error saving income: ${err.response?.data?.message || err.message}`, {
        duration: 4000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
    }
  };


  // const handleDelete = async slug => {
  //   try {
  //     const confirmDelete = window.confirm('Are you sure you want to delete this income');
  //     if (!confirmDelete) return;

  //     await axios.delete(`https://fintrack-api-9u9p.onrender.com/api/incomes/${slug}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     fetchIncomes();
  //     toast.success("Income deleted successfully", {
  //       position: "top-center",
  //       style: {
  //         background: "green",
  //         color: "#fff",
  //       },
  //     });
  //   } catch (err) {
  //     // console.error('Error deleting income:', err);
  //     toast.error(`Error deleting income: ${err.response?.data?.message || err.message}`, {
  //       duration: 4000,
  //       style: {
  //         background: "red",
  //         color: "#fff",
  //       },
  //     });
  //   }
  // };

  const handleDelete = async (slug) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', }}>
        <p>Are you sure you want to delete this income?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            style={{ background: 'red', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}
            onClick={async () => {
              try {
                await axios.delete(`https://fintrack-api-9u9p.onrender.com/api/incomes/${slug}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.dismiss(t.id);
                toast.success('Income deleted successfully');
                fetchIncomes();
              } catch (err) {
                toast.dismiss(t.id);
                toast.error(`Error deleting income: ${err.response?.data?.message || err.message}`);
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


  const openEditModal = income => {
    setEditIncome(income);
    setFormData({
      title: income.title || '',
      amount: income.amount || '',
      source: income.source || '',
      date: income.date ? income.date.slice(0, 10) : '',
      description: income.description || ''
    });
    setModalOpen(true);
  };

  return (
    <main className="income-page">
      <Toaster position="top-center" toastOptions={{duration: 4000}} />

      {isLoading ? (
        <Loader/>
      ) : (
        <>
          <section className="income-header">
            <h1>Incomes</h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btnothe" onClick={() => { setModalOpen(true); setEditIncome(null); }}>
                Add Income
              </button>
            </div>
          </section>

          <section className="income-filters">
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
            <button className='btnothe' onClick={handleFilter}>
              <FaSearch /> Search
            </button>
            <button className='btnStyles' onClick={resetFilter}>
              Reset
            </button>
          </section>

          <section className="income-table">
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
                {incomes.length > 0 ? (
                  incomes.map(income => (
                    <tr key={income.slug || income._id || Math.random()}>
                      <td data-label="Date">{income.date ? new Date(income.date).toLocaleDateString() : '-'}</td>
                      <td data-label="Title">{income.title || '-'}</td>
                      <td data-label="Source">{income.source || '-'}</td>
                      <td data-label="Amount">{income.amount != null ? Number(income.amount).toLocaleString() : '-'}</td>
                      <td data-label="Description">{income.description || '-'}</td>
                      <td data-label="Actions" className='now'>
                        <button className='btnStyle' onClick={() => openEditModal(income)} title="Edit">
                          <FaPencilAlt />
                        </button>
                        <button className='btnStyle' onClick={() => handleDelete(income.slug)} title="Delete">
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No income records found.</td>
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
            <h2>{editIncome ? 'Edit Income' : 'Add Income'}</h2>
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
              />
              <div className="modal-actions">
                <button type="submit" className='btnothe'>
                  {editIncome ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  className='btnothe'
                  onClick={() => {
                    setModalOpen(false);
                    setEditIncome(null);
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
  );
}
