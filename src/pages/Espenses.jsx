import React, { useState } from 'react';
import '../styles/pages/expences.css';

export default function Espenses() {
const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ source: '', minAmount: '', maxAmount: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', source: '', date: '', description: '' });

  return (
    <main className="expenses-page">
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
                    <button className="btn-blue">Delete</button>
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
            <form>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
              />
              <input
                type="text"
                name="source"
                placeholder="Source"
                value={formData.source}
              />
              <input
                type="date"
                name="date"
                value={formData.date}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
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