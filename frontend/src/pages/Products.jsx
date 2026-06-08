import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { formatMAD } from '../utils/format';
import './Products.css';

/**
 * Returns a stock status badge based on quantity thresholds.
 */
function StockBadge({ quantity }) {
  if (quantity <= 0) return <span className="badge badge-danger">Rupture</span>;
  if (quantity < 10) return <span className="badge badge-warning">Faible</span>;
  return <span className="badge badge-success">En stock</span>;
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', sku: '', description: '', quantity: 0, price: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    api.get('/products/export/csv', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => alert('Échec de l\'export CSV'));
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      await api.post('/products/import/csv', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Import réussi !');
      fetchProducts();
    } catch (error) {
      alert('Échec de l\'import. Vérifiez le format CSV.');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setShowForm(true);
  };

  const handleMovement = async (product, type) => {
    const qtyStr = window.prompt(`Quantité à ${type === 'entry' ? 'ajouter' : 'retirer'} :`);
    const quantity = parseInt(qtyStr, 10);
    if (!quantity || quantity <= 0) return;

    try {
      await api.post('/stock-movements', {
        product_id: product.id,
        type,
        quantity,
        notes: `${type === 'entry' ? 'Entrée' : 'Sortie'} rapide depuis la page Produits`
      });
      fetchProducts();
    } catch(err) {
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/products/${formData.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowForm(false);
      setFormData({ id: null, name: '', sku: '', description: '', quantity: 0, price: 0 });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product', error);
    }
  };

  return (
    <div>
      <div className="header-actions">
        <h1 className="page-title">Produits</h1>
        <div className="btn-group">
          <button className="btn-secondary" onClick={handleExport}>⬇ Export CSV</button>
          <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>⬆ Import CSV</button>
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button className="btn-primary" onClick={() => { setShowForm(true); setFormData({ id: null, name: '', sku: '', description: '', quantity: 0, price: 0 }); }}>
            + Nouveau produit
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{formData.id ? 'Modifier le produit' : 'Nouveau produit'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input required placeholder="Nom du produit" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Référence (SKU)" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              <input type="number" required placeholder="Quantité" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <input type="number" step="0.01" required placeholder="Prix (DH)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <textarea placeholder="Description (optionnel)" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="full-width" rows={2} />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Chargement...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Référence</th>
              <th>Quantité</th>
              <th>Statut</th>
              <th>Prix unitaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td><code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{p.sku}</code></td>
                <td>{p.quantity}</td>
                <td><StockBadge quantity={p.quantity} /></td>
                <td>{formatMAD(p.price)}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => handleMovement(p, 'entry')} className="btn-ghost text-success" title="Entrée de stock">+ Entrée</button>
                    <button onClick={() => handleMovement(p, 'exit')} className="btn-ghost text-warning" title="Sortie de stock">− Sortie</button>
                    <button onClick={() => handleEdit(p)} className="btn-ghost text-primary">Modifier</button>
                    <button onClick={() => handleDelete(p.id)} className="btn-ghost text-danger">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" className="text-center" style={{ padding: '2rem', color: '#94a3b8' }}>Aucun produit trouvé.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Products;
