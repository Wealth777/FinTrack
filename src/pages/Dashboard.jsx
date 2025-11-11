import '../styles/pages/dashboard.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {

  const summary = [
    { title: 'Income', value: '$0' },
    { title: 'Expenses', value: '$0' },
    { title: 'Total Balance', value: '$0' },
  ];

  // Demo chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Spending',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#18ff37',
        backgroundColor: 'rgba(24,255,55,0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#000' } },
      title: { display: true, text: 'Monthly Spending', color: '#000' },
    },
    scales: {
      x: { ticks: { color: '#000' } },
      y: { ticks: { color: '#000' } },
    },
  };


  return (
    <main className="dashboard-page">
      <section className="summary-cards">
        {summary.map((item, index) => (
          <div key={index} className="card">
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="chart-section">
        <Line data={chartData} options={chartOptions} />
      </section>

      <section className="recent-activities">
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
            <tr >
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
};
