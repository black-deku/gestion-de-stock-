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
      <div className="page-header">
        <h1 className="page-title">Mouvements de stock</h1>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Chargement...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Utilisateur</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td>{m.product?.name || 'Inconnu'}</td>
                <td>
                  <span className={`badge ${m.type === 'entry' ? 'badge-success' : 'badge-warning'}`}>
                    {m.type === 'entry' ? 'Entrée' : 'Sortie'}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{m.type === 'entry' ? '+' : '−'}{m.quantity}</td>
                <td>{m.user?.name || 'Système'}</td>
                <td style={{ color: '#94a3b8' }}>{m.notes || '—'}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr><td colSpan="6" className="text-center" style={{ padding: '2rem', color: '#94a3b8' }}>Aucun mouvement enregistré.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Movements;
