import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { formatMAD } from '../utils/format';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const handleDownloadReport = () => {
    api.get('/reports/stock/pdf', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stock_report.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => alert('Failed to download report'));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>📊 Dashboard Overview</h1>
        <button className="btn-primary" onClick={handleDownloadReport}>
          📄 Download Full PDF Report
        </button>
      </div>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.total_products}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stock Value</h3>
          <p>{formatMAD(stats.total_value)}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p style={{ color: stats.low_stock.length > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {stats.low_stock.length}
          </p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="chart-container">
          <h3>Weekly Stock Movements</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chart_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Entries" fill="var(--color-success)" />
                <Bar dataKey="Exits" fill="var(--color-warning)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="alert-container">
          <h3>⚠️ Low Stock Alerts</h3>
          <ul className="alert-list">
            {stats.low_stock.length === 0 ? (
              <p>No alerts. Stock is healthy.</p>
            ) : (
              stats.low_stock.map((item) => (
                <li key={item.id} className="alert-card">
                  <strong>{item.name}</strong>
                  <span>Only {item.quantity} left in stock</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
