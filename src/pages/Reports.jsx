import React, { useEffect, useState } from "react";
import "../styles/pages/reports.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Reports() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Placeholder for API logic
  useEffect(() => {
    // Example: fetchReportSummary();
    // Example: fetchChartData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Financial Reports</h2>
        <button className="export-btn">Export Report</button>
      </div>

      <div className="summary-grid">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p>₦{summary.totalIncome}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p>₦{summary.totalExpenses}</p>
        </div>
        <div className="summary-card balance">
          <h3>Net Balance</h3>
          <p>₦{summary.balance}</p>
        </div>
      </div>

      <div className="chart-section">
        {chartData.labels.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p className="no-data">No chart data available</p>
        )}
      </div>
    </div>
  );
}
