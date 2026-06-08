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

  if (!stats) return <p style={{ padding: '2rem', color: '#94a3b8' }}>Chargement du tableau de bord...</p>;

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
      .catch(() => alert('Échec du téléchargement du rapport'));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <button className="btn-primary" onClick={handleDownloadReport}>
          📄 Rapport PDF
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Total Produits</span>
          <span className="stat-value">{stats.total_products}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Valeur du Stock</span>
          <span className="stat-value">{formatMAD(stats.total_value)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Stock Faible</span>
          <span className={`stat-value ${stats.low_stock.length > 0 ? 'danger' : 'success'}`}>
            {stats.low_stock.length}
          </span>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="chart-container">
          <h3 className="section-title">📈 Mouvements de la semaine</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chart_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="Entries" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Exits" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="alert-container">
          <h3 className="section-title">⚠️ Alertes de stock</h3>
          {stats.low_stock.length === 0 ? (
            <div className="alert-empty">
              <p>Aucune alerte. Stock en bon état.</p>
            </div>
          ) : (
            <ul className="alert-list">
              {stats.low_stock.map((item) => (
                <li key={item.id} className="alert-card">
                  <strong>{item.name}</strong>
                  <span>{item.quantity} restant{item.quantity > 1 ? 's' : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
