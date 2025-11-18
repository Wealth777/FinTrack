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
    // fetchDashboard();
  }, []);

  // Prepare chart
  // const chartLabels = monthlyData.map(m => m.month);
  // const chartValues = monthlyData.map(m => m.total);

  // const chartData = {
  //   labels: chartLabels,
  //   datasets: [
  //     {
  //       label: "Monthly Spending",
  //       data: chartValues,
  //       borderColor: "#18ff37",
  //       backgroundColor: "rgba(24,255,55,0.2)",
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: "top", labels: { color: "#000" } },
  //     title: { display: true, text: "Monthly Spending", color: "#000" },
  //   },
  //   scales: {
  //     x: { ticks: { color: "#000" } },
  //     y: { ticks: { color: "#000" } },
  //   },
  // };

  return (
    <main className="dashboard-page">
    <Toaster position="top-center" toastOptions={{duration: 4000}} />

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

          {/* Chart Section */}
          {/* <section className="chart-section">
            <Line data={chartData} options={chartOptions} />
          </section> */}

          {/* Recent Activity */}
          {/* <section className="recent-activities">
            <h2>Recent Activities</h2>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {recent.length === 0 && (
                  <tr>
                    <td colSpan="3">No recent activities</td>
                  </tr>
                )}

                {recent.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.type}</td>
                    <td>₦{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section> */}
        </>
      )
      }
    </main >
  );
}