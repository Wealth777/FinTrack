import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaSearch, FaTrashAlt } from 'react-icons/fa'
import '../styles/pages/income.css';

export default function Income() {
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


  const fetchIncomes = async () => {
    try {
      const response = await axios.get('https://fintrack-api-9u9p.onrender.com/api/incomes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setIncomes(response.data);
      } else {
        // console.error('Unexpected response:', response.data);
        setIncomes([]);
      }
    } catch (err) {
      // console.error('Error fetching incomes:', err);
      setIncomes([]);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);


  const handleFilter = () => {
    let filtered = [...incomes];
    if (filter.source) filtered = filtered.filter(i => i.source.toLowerCase().includes(filter.source.toLowerCase()));
    if (filter.minAmount) filtered = filtered.filter(i => Number(i.amount) >= Number(filter.minAmount));
    if (filter.maxAmount) filtered = filtered.filter(i => Number(i.amount) <= Number(filter.maxAmount));
    setIncomes(filtered);
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
      } else {
        await axios.post('https://fintrack-api-9u9p.onrender.com/api/incomes', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      fetchIncomes();
      setModalOpen(false);
      setEditIncome(null);
      setFormData({ title: '', amount: '', source: '', date: '', description: '' });
    } catch (err) {
      // console.error('Error saving income:', err);
    }
  };


  const handleDelete = async slug => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this income');
      if (!confirmDelete) return;

      await axios.delete(`https://fintrack-api-9u9p.onrender.com/api/incomes/${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchIncomes();
    } catch (err) {
      // console.error('Error deleting income:', err);
    }
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
      <section className="income-header">
        <h1>Incomes</h1>
        <button className='btnothe' onClick={() => setModalOpen(true)}>
          Add Income
        </button>
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
        <button className='btnStyles' onClick={handleFilter}>
          <FaSearch />
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
                <tr key={income.slug}>
                  <td>{income.date}</td>
                  <td>{income.title}</td>
                  <td>{income.source}</td>
                  <td>{income.amount}</td>
                  <td>{income.description}</td>
                  <td>
                    <button className='btnStyle' onClick={() => openEditModal(income)}>
                      <FaPencilAlt/>
                    </button>
                    <button className='btnStyle' onClick={() => handleDelete(income.slug)}>
                      <FaTrashAlt/>
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
