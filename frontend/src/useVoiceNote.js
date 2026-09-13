import { useState, useRef } from 'react';

export function useVoiceNote() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const supported = !!SR;

  function start() {
    if (!supported) { setError('Voice input is not supported in this browser.'); return; }
    setError(''); setTranscript('');
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalText = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript + ' ';
        else interim += event.results[i][0].transcript;
      }
      setTranscript(finalText + interim);
    };
    recognition.onerror = (e) => {
      setError(e.error === 'not-allowed' ? 'Microphone access denied — check your browser settings.' : 'Could not hear you clearly — try again.');
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stop() {
    recognitionRef.current?.stop();
  }

  return { listening, transcript, error, start, stop, supported };
}
