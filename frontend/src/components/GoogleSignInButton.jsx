import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onCredential, onError }) {
  const containerRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return; // not configured — component renders nothing
    if (window.google?.accounts?.id) { setScriptReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => onError?.('Could not load Google sign-in — check your connection.');
    document.head.appendChild(script);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!scriptReady || !CLIENT_ID || !containerRef.current) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: 'outline', size: 'large', width: 320, text: 'continue_with',
    });
  }, [scriptReady]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!CLIENT_ID) return null; // Google sign-in not configured — hide entirely rather than show a broken button

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }} />;
}
