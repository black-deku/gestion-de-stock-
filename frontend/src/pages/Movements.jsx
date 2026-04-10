import { useState, useEffect } from 'react';
import api from '../api/axios';

function Movements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const { data } = await api.get('/stock-movements');
        setMovements(data);
      } catch (error) {
        console.error('Failed to fetch movements', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>🔄 Stock Movements</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>User</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.created_at).toLocaleString()}</td>
                <td>{m.product?.name || 'Unknown'}</td>
                <td>
                  <span style={{
                    color: m.type === 'entry' ? 'white' : 'white',
                    backgroundColor: m.type === 'entry' ? 'var(--color-success)' : 'var(--color-warning)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85em'
                  }}>
                    {m.type.toUpperCase()}
                  </span>
                </td>
                <td>{m.quantity}</td>
                <td>{m.user?.name || 'System'}</td>
                <td>{m.notes || '-'}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr><td colSpan="6" className="text-center">No movements found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Movements;
