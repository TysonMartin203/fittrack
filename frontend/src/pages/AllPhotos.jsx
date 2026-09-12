import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { compressImage } from '../compressImage';
import { today, formatDateStr } from '../dateUtils';

export default function AllPhotos() {
  const [photos,    setPhotos]    = useState([]);
  const [date,      setDate]      = useState(today());
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error,     setError]     = useState('');
  const fileRef = useRef();

  useEffect(() => {
    api.getPhotos().then(setPhotos).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setCompressing(true);
    const compressed = await compressImage(f);
    setFile(compressed);
    setPreview(URL.createObjectURL(compressed));
    setCompressing(false);
  }

  async function upload(e) {
    e.preventDefault();
    if (!file) return setError('Select a photo first');
    setError(''); setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('photoDate', date);
      const newPhoto = await api.uploadPhoto(fd);
      setPhotos(p => [newPhoto, ...p]);
      setFile(null); setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="page"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>All Photos</h2>
        <Link to="/photos" className="link-small">← Progress</Link>
      </div>

      <div className="card-form">
        <form onSubmit={upload} className="form-stack">
          <div className="field">
            <label className="label">Date</label>
            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Photo</label>
            <input className="input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" ref={fileRef} onChange={onFile} />
          </div>
          {compressing && <p className="muted" style={{fontSize:'12px'}}>Optimizing photo…</p>}
          {preview && !compressing && <img src={preview} alt="preview" className="photo-preview" />}
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={uploading || compressing}>
            {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </form>
      </div>

      {photos.length === 0
        ? <p className="muted">No photos yet. Upload your first progress photo!</p>
        : (
          <div className="photo-grid">
            {photos.map((ph, i) => (
              <div key={ph.id} className="photo-card" style={{animationDelay:`${i*.05}s`}}>
                <img src={api.fileUrl(ph.file_path)} alt={ph.photo_date} className="photo-img" />
                <div className="photo-footer">
                  <span>{formatDateStr(ph.photo_date)}</span>
                  <button className="btn-ghost-sm" onClick={() => {
                    api.deletePhoto(ph.id);
                    setPhotos(p => p.filter(x => x.id !== ph.id));
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
