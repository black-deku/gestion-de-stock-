import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>📊 Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.total_products}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stock Value</h3>
          <p>${Number(stats.total_value).toFixed(2)}</p>
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
