import { useEffect, useRef, useState } from 'react';
import { useVoiceNote } from '../useVoiceNote';
import { IconMic } from './Icons';

// For plain notes fields — just transcribes and appends, no AI structuring involved.
export default function VoiceAppendButton({ onAppend }) {
  const { listening, transcript, error, start, stop, supported } = useVoiceNote();
  const wasListening = useRef(false);
  const [emptyNotice, setEmptyNotice] = useState(false);

  useEffect(() => {
    if (wasListening.current && !listening) {
      if (transcript.trim()) { setEmptyNotice(false); onAppend(transcript.trim()); }
      else setEmptyNotice(true);
    }
    wasListening.current = listening;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  if (!supported) return null;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        type="button"
        onClick={() => { setEmptyNotice(false); listening ? stop() : start(); }}
        title={listening ? 'Listening… tap to stop' : 'Add by voice'}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '26px', height: '26px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: listening ? 'var(--danger)' : 'var(--surface-tint)',
          color: listening ? '#fff' : 'var(--accent)',
        }}
      >
        <IconMic style={{ width: '13px', height: '13px' }} />
      </button>
      {(error || emptyNotice) && <span className="form-error" style={{ fontSize: '11px' }}>{error || 'Didn\'t catch anything — try again.'}</span>}
    </span>
  );
}
