import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { formatMAD } from '../utils/format';
import './Products.css';

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
      .catch(() => alert('Failed to export CSV'));
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
      alert('Import successful!');
      fetchProducts();
    } catch (error) {
      alert('Import failed. Please check the CSV format.');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setShowForm(true);
  };

  const handleMovement = async (product, type) => {
    const qtyStr = window.prompt(`Enter quantity to ${type === 'entry' ? 'add to' : 'remove from'} stock:`);
    const quantity = parseInt(qtyStr, 10);
    if (!quantity || quantity <= 0) return;
    
    try {
      await api.post('/stock-movements', {
        product_id: product.id,
        type,
        quantity,
        notes: `Quick ${type} from Products page`
      });
      fetchProducts();
    } catch(err) {
      alert('Error updating stock');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
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
        <h1>📦 Products</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={handleExport}>
            ⬇ Export CSV
          </button>
          <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
            ⬆ Import CSV
          </button>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button className="btn-primary" onClick={() => { setShowForm(true); setFormData({ id: null, name: '', sku: '', description: '', quantity: 0, price: 0 }); }}>
            + Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{formData.id ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="SKU" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              <input type="number" required placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <input type="number" step="0.01" required placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="full-width" />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.quantity}</td>
                <td>{formatMAD(p.price)}</td>
                <td>
                  <button onClick={() => handleMovement(p, 'entry')} className="btn-text" style={{color: 'var(--color-success)'}}>+ Add</button>
                  <button onClick={() => handleMovement(p, 'exit')} className="btn-text" style={{color: 'var(--color-warning)'}}>- Remove</button>
                  <button onClick={() => handleEdit(p)} className="btn-text">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="btn-text text-danger">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="text-center">No products found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Products;
