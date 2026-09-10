import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';

const today = () => new Date().toISOString().split('T')[0];

export default function ProgressPhotos() {
  const [photos,   setPhotos]  = useState([]);
  const [date,     setDate]    = useState(today());
  const [file,     setFile]    = useState(null);
  const [preview,  setPreview] = useState(null);
  const [loading,  setLoading] = useState(true);
  const [uploading,setUploading] = useState(false);
  const [error,    setError]   = useState('');
  const fileRef = useRef();

  useEffect(() => {
    api.getPhotos()
      .then(setPhotos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function upload(e) {
    e.preventDefault();
    if (!file) return setError('Select a photo first');
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('photoDate', date);
      const newPhoto = await api.uploadPhoto(fd);
      setPhotos(p => [newPhoto, ...p]);
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function remove(id) {
    await api.deletePhoto(id);
    setPhotos(p => p.filter(ph => ph.id !== id));
  }

  if (loading) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <h2 className="page-title">Progress Photos 📷</h2>

      <form onSubmit={upload} className="card-form">
        <label className="label">Date</label>
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required />

        <label className="label">Photo</label>
        <input className="input" type="file" accept="image/jpeg,image/png,image/webp" ref={fileRef} onChange={onFile} />
        {preview && <img src={preview} alt="preview" className="photo-preview" />}

        {error && <p className="form-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </button>
      </form>

      <div className="photo-grid">
        {photos.map(ph => (
          <div key={ph.id} className="photo-card">
            <img src={api.photoUrl(ph.file_path)} alt={ph.photo_date} className="photo-img" />
            <div className="photo-footer">
              <span>{new Date(ph.photo_date).toLocaleDateString()}</span>
              <button className="btn-ghost-sm" onClick={() => remove(ph.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {photos.length === 0 && <p className="muted">No photos yet.</p>}
    </div>
  );
}
