import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileInputRef.current.files[0] || !docName) return;

    const formData = new FormData();
    formData.append('name', docName);
    formData.append('file', fileInputRef.current.files[0]);

    setUploading(true);
    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocName('');
      fileInputRef.current.value = null;
      fetchDocuments();
    } catch (error) {
      alert('Échec de l\'upload : ' + (error.response?.data?.message || 'Vérifiez la taille max (10 Mo) et le format (PDF)'));
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = (id, filename) => {
    api.get(`/documents/${id}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => alert('Échec du téléchargement'));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce document ?')) {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Documents</h1>
      </div>

      <div className="form-card">
        <h3>Téléverser un PDF</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Nom du document"
              required
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
          <input
            type="file"
            accept="application/pdf"
            required
            ref={fileInputRef}
            style={{ fontSize: 'var(--font-size-sm)' }}
          />
          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'Upload...' : 'Téléverser'}
          </button>
        </form>
      </div>

      {loading ? <p style={{ color: '#94a3b8' }}>Chargement...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ajouté par</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.user?.name}</td>
                <td>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => downloadFile(doc.id, doc.name)} className="btn-ghost text-primary">Télécharger</button>
                    <button onClick={() => handleDelete(doc.id)} className="btn-ghost text-danger">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan="4" className="text-center" style={{ padding: '2rem', color: '#94a3b8' }}>Aucun document téléversé.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Documents;
