import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TRACKABLE_ACTIVITIES = ['Running', 'Walking', 'Biking'];
const ROUTE_COLOR = '#E07A5F';

// Max plausible speed per activity (mph) — anything faster is treated as a GPS glitch and dropped.
const MAX_MPH = { Running: 25, Walking: 12, Biking: 40 };

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatElapsed(sec) {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${m}:${String(s).padStart(2,'0')}`;
}
function formatPace(minutesTotal, miles) {
  if (!miles || miles <= 0) return '—';
  const paceMin = minutesTotal / miles;
  const m = Math.floor(paceMin);
  const s = Math.round((paceMin - m) * 60);
  return `${m}:${String(s).padStart(2,'0')} /mi`;
}

export default function RunTracker() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState('Running');
  const [status, setStatus] = useState('idle'); // idle | tracking | paused | finished
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const polylineRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);
  const wakeLockRef = useRef(null);
  const pointsRef = useRef([]); // [{lat,lng,t}]
  const startTimeRef = useRef(null);
  const pausedMsRef = useRef(0);
  const pauseStartRef = useRef(null);
  const tickRef = useRef(null);

  // Map container renders for the whole lifetime of the page (idle screen just hides it via CSS),
  // so the Leaflet instance never gets detached from its DOM node between tracking → finished.
  useEffect(() => {
    if (mapRef.current && !mapObjRef.current) {
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([39.8283, -98.5795], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      polylineRef.current = L.polyline([], { color: ROUTE_COLOR, weight: 5 }).addTo(map);
      mapObjRef.current = map;
    }
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leaflet needs a nudge to redraw correctly once its container becomes visible again.
  useEffect(() => {
    if (status !== 'idle' && mapObjRef.current) {
      setTimeout(() => mapObjRef.current.invalidateSize(), 50);
    }
  }, [status]);

  function cleanup() {
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    if (wakeLockRef.current) wakeLockRef.current.release?.().catch(()=>{});
  }

  async function requestWakeLock() {
    try { wakeLockRef.current = await navigator.wakeLock?.request('screen'); } catch { /* unsupported or denied — fine, just not ideal */ }
  }

  function onPosition(pos) {
    const { latitude: lat, longitude: lng, accuracy } = pos.coords;
    if (accuracy != null && accuracy > 30) return; // too noisy, skip

    const map = mapObjRef.current;
    const last = pointsRef.current[pointsRef.current.length - 1];
    const now = Date.now();

    if (last) {
      const dtSec = (now - last.t) / 1000;
      if (dtSec < 1.5) return; // debounce noisy rapid-fire updates
      const segMiles = haversineMiles(last.lat, last.lng, lat, lng);
      const impliedMph = segMiles / (dtSec / 3600);
      if (impliedMph > (MAX_MPH[activity] || 25)) return; // implausible jump — GPS glitch
      setDistance(d => d + segMiles);
    }

    pointsRef.current.push({ lat, lng, t: now });
    polylineRef.current.addLatLng([lat, lng]);

    if (!markerRef.current) {
      markerRef.current = L.circleMarker([lat, lng], { radius: 7, color: ROUTE_COLOR, fillColor: ROUTE_COLOR, fillOpacity: 1 }).addTo(map);
    } else {
      markerRef.current.setLatLng([lat, lng]);
    }
    map.setView([lat, lng], map.getZoom() < 15 ? 16 : map.getZoom());
  }

  function onGeoError(err) {
    setError(err.code === 1 ? 'Location permission denied. Enable it in your browser settings to track a run.' : 'Could not get your location. Check your GPS/location settings and try again.');
    setStatus('idle');
  }

  function start() {
    if (!navigator.geolocation) { setError('Your browser does not support location tracking.'); return; }
    setError('');
    pointsRef.current = [];
    setDistance(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    pausedMsRef.current = 0;
    if (polylineRef.current) polylineRef.current.setLatLngs([]);
    if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }

    requestWakeLock();
    watchIdRef.current = navigator.geolocation.watchPosition(onPosition, onGeoError, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
    tickRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current - pausedMsRef.current) / 1000));
    }, 1000);
    setStatus('tracking');
  }

  function pause() {
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    pauseStartRef.current = Date.now();
    setStatus('paused');
  }

  function resume() {
    pausedMsRef.current += Date.now() - pauseStartRef.current;
    watchIdRef.current = navigator.geolocation.watchPosition(onPosition, onGeoError, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
    setStatus('tracking');
  }

  function stop() {
    cleanup();
    setStatus('finished');
  }

  function discard() {
    cleanup();
    pointsRef.current = [];
    setDistance(0);
    setElapsed(0);
    setError('');
    if (polylineRef.current) polylineRef.current.setLatLngs([]);
    if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
    setStatus('idle');
  }

  function saveAsWorkout() {
    const minutes = elapsed / 60;
    navigate('/log/new', {
      state: {
        initialExercises: [{
          category: 'cardio',
          exerciseName: activity,
          notes: '',
          durationMinutes: Math.max(1, Math.round(minutes)),
          distance: distance.toFixed(2),
          distanceUnit: 'mi',
          calories: '',
          avgHeartRate: '',
          pace: formatPace(minutes, distance),
        }],
        planLabel: `Tracked ${activity}`,
      },
    });
  }

  const paceStr = formatPace(elapsed / 60, distance);
  const showMap = status !== 'idle';

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Run, Walk, Bike</h2>
        <Link to="/log" className="link-small">← Workouts</Link>
      </div>

      {status === 'idle' && (
        <>
          <p className="muted" style={{fontSize:'13px',marginBottom:'16px'}}>
            Uses your phone's GPS to track distance and pace. Keep this screen open and your phone unlocked while tracking — tracking pauses if your phone locks or the app goes to the background.
          </p>
          <div className="tab-row" style={{marginBottom:'20px'}}>
            {TRACKABLE_ACTIVITIES.map(a => (
              <button key={a} className={activity===a?'tab active':'tab'} onClick={()=>setActivity(a)}>{a}</button>
            ))}
          </div>
          {error && <p className="form-error" style={{marginBottom:'16px'}}>{error}</p>}
          <button className="btn-primary" onClick={start}>Start Tracking</button>
        </>
      )}

      <div ref={mapRef} style={{
        width:'100%', height: status==='finished' ? '220px' : '280px', borderRadius:'var(--r-lg)',
        marginBottom: showMap ? '16px' : 0, border: showMap ? '1px solid var(--border)' : 'none',
        display: showMap ? 'block' : 'none',
      }}/>

      {(status === 'tracking' || status === 'paused') && (
        <>
          <div className="stat-row" style={{marginBottom:'20px'}}>
            <div className="stat-card">
              <span className="stat-num">{formatElapsed(elapsed)}</span>
              <span className="stat-label">Time</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{distance.toFixed(2)}</span>
              <span className="stat-label">Miles</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{fontSize:'20px'}}>{paceStr}</span>
              <span className="stat-label">Pace</span>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            {status === 'tracking'
              ? <button className="btn-secondary" style={{flex:1}} onClick={pause}>Pause</button>
              : <button className="btn-secondary" style={{flex:1}} onClick={resume}>Resume</button>
            }
            <button className="btn-danger" style={{flex:1}} onClick={stop}>Finish</button>
          </div>
        </>
      )}

      {status === 'finished' && (
        <>
          <div className="stat-row" style={{marginBottom:'20px'}}>
            <div className="stat-card">
              <span className="stat-num">{formatElapsed(elapsed)}</span>
              <span className="stat-label">Time</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{distance.toFixed(2)}</span>
              <span className="stat-label">Miles</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{fontSize:'20px'}}>{paceStr}</span>
              <span className="stat-label">Pace</span>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button className="btn-ghost-sm" onClick={discard}>Discard</button>
            <button className="btn-primary" style={{flex:1}} onClick={saveAsWorkout}>Save as Workout</button>
          </div>
        </>
      )}
    </div>
  );
}
