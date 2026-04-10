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
      alert('Upload failed: ' + (error.response?.data?.message || 'Check max file size (10MB) and format (PDF)'));
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
      .catch(() => alert('Failed to download file'));
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this document?')) {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>📄 Documents (PDFs)</h1>
      
      <div className="form-card">
        <h3>Upload PDF</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Document Name" 
            required 
            value={docName} 
            onChange={(e) => setDocName(e.target.value)} 
            style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid var(--color-border)' }}
          />
          <input 
            type="file" 
            accept="application/pdf" 
            required 
            ref={fileInputRef} 
            style={{ padding: '0.5rem' }}
          />
          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.user?.name}</td>
                <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => downloadFile(doc.id, doc.name)} className="btn-text" style={{color: 'var(--color-primary)'}}>Download</button>
                  <button onClick={() => handleDelete(doc.id)} className="btn-text text-danger">Delete</button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan="4" className="text-center">No documents uploaded yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Documents;
