import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "../styles/pages/dashboard.css";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  // const [monthlyData, setMonthlyData] = useState([]);
  // const [recent, setRecent] = useState([]);


  const fetchSummary = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        "https://fintrack-api-9u9p.onrender.com/api/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSummary({
        totalIncome: res.data.total_income,
        totalExpenses: res.data.total_expense,
        balance: res.data.balance,
      });
    } catch (err) {
      toast.error(`Error loading summary: ${err.response?.data?.message || err.message}`, { duration: 4000 });
    } finally {
      setIsLoading(false)
    }
  };

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        'https://fintrack-api-9u9p.onrender.com/api/expenses',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (res.data && Array.isArray(res.data)) {
        setExpenses(res.data)
      } else {
        setExpenses([])
        toast.error('No expenses records found', {
          duration: 4000,
          style: { background: 'red', color: '#fff' }
        })
      }
    } catch (err) {
      toast.error(`Error loading expenses: ${err.response?.data?.message || err.message}`, { duration: 4000 });
    } finally {
      setIsLoading(false)
    }
  }

  const fetchIncomes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://fintrack-api-9u9p.onrender.com/api/incomes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data && Array.isArray(res.data)) {
        setIncomes(res.data);
      } else {
        toast.error('No income records found', {
          duration: 4000,
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
    } catch (err) {
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
  }

  const today = new Date().toISOString().split("T")[0];


  const todaysExpenses = expenses.filter(exp => {
    const expDate = exp.date?.split("T")[0];
    return expDate === today;
  });


  const totalSpentToday = todaysExpenses.reduce((sum, exp) => {
    return sum + Number(exp.amount || 0);
  }, 0);


  const todaysIncome = incomes.filter(exp => {
    const expDate = exp.date?.split("T")[0];
    return expDate === today;
  });

  // Sum today's expenses
  const totalIncomeToday = todaysIncome.reduce((sum, exp) => {
    return sum + Number(exp.amount || 0);
  }, 0);


  const categoryTotals = {};

  expenses.forEach(exp => {
    const category = exp.category;
    const amount = Number(exp.amount || 0);

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += amount;
  });


  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);


  const topCategories = sortedCategories.slice(0, 3);

  const incomeTotals = {};

  incomes.forEach(inc => {
    const source = inc.source;
    const amount = Number(inc.amount || 0);

    if (!incomeTotals[source]) {
      incomeTotals[source] = 0;
    }

    incomeTotals[source] += amount;
  });

  const sortedIncomeSources = Object.entries(incomeTotals)
    .sort((a, b) => b[1] - a[1]);

  const topIncomeSources = sortedIncomeSources.slice(0, 3);

  // Fetch /dashboard
  // const fetchDashboard = async () => {
  //   try {
  //     const res = await axios.get(
  //       "https://fintrack-api-9u9p.onrender.com/api/dashboard",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setMonthlyData(res.data.monthly || []);
  //     setRecent(res.data.recent || []);
  //   } catch (err) {
  //     toast.error(`Error loading dashbord: ${err.response?.data?.message || err.message}`, { duration: 4000 });
  //   }
  // };

  useEffect(() => {
    fetchSummary();
    fetchExpenses();
    fetchIncomes();
  }, []);


  return (
    <main className="dashboard-page">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Summary Cards */}
          <section className="summary-cards">
            <div className="card">
              <h3>Income</h3>
              <p>₦{summary.totalIncome}</p>
            </div>

            <div className="card">
              <h3>Expenses</h3>
              <p>₦{summary.totalExpenses}</p>
            </div>

            <div className="card">
              <h3>Total Balance</h3>
              <p>₦{summary.balance}</p>
            </div>
          </section>

          <section className="summaryOfTheDay income-table">
            <h2>Today Income</h2>

            <div className="card today-card">
              <h3>Total Income Today</h3>
              <p>₦{totalIncomeToday}</p>
            </div>

            <table style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {todaysIncome.length > 0 ? (
                  todaysIncome.map(income => (
                    <tr key={income._id}>
                      <td data-label='Date'>{income.date?.split("T")[0]}</td>
                      <td data-label='Title'>{income.title}</td>
                      <td data-label='Category'>{income.source}</td>
                      <td data-label='Amount'>₦{income.amount}</td>
                      <td data-label='Description'>{income.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No expense found for today</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="quick-links">
              <Link to={'/income'}>
                <button className="btn-link">
                  View more incomes
                </button>
              </Link>
            </div>
          </section>

          <section className="summaryOfTheDay income-table">
            <h2>Today Spending</h2>

            <div className="card today-card">
              <h3>Total Spent Today</h3>
              <p>₦{totalSpentToday}</p>
            </div>

            <table style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {todaysExpenses.length > 0 ? (
                  todaysExpenses.map(expense => (
                    <tr key={expense._id}>
                      <td data-label='Date'>{expense.date?.split("T")[0]}</td>
                      <td data-label='Title'>{expense.title}</td>
                      <td data-label='Category'>{expense.category}</td>
                      <td data-label='Amount'>₦{expense.amount}</td>
                      <td data-label='Description'>{expense.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No expense found for today</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="quick-links">
              <Link to={'/expenses'}>
                <button className="btn-link">
                  View more expenses
                </button>
              </Link>
            </div>
          </section>


          <section className="summary-cards">
            <section className="top-categories">
              <h2>Top Income Sources</h2>

              {topIncomeSources.length > 0 ? (
                <ul className="category-list">
                  {topIncomeSources.map(([source, total]) => (
                    <li key={source} className="category-item">
                      <span className="category-name">{source}</span>
                      <span className="category-amount">₦{total}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No income data found</p>
              )}
            </section>


            <section className="top-categories">
              <h2>Top Spending Categories</h2>

              {topCategories.length > 0 ? (
                <ul className="category-list">
                  {topCategories.map(([category, total]) => (
                    <li key={category} className="category-item">
                      <span className="category-name">{category}</span>
                      <span className="category-amount">₦{total}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No category data found</p>
              )}
            </section>
          </section>

        </>
      )
      }
    </main >
  );
}


// 2. Monthly budget progress
//    Show how much of each budget is used.
//    Example, Food: 40 percent used.
