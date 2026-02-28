import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, RotateCcw } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Transcription.css';

const API_ENDPOINT =
  'https://karaa-mm6145sg-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-beszedtoszoveg/audio/transcriptions?api-version=2025-03-01-preview';

export default function Transcription({ audioFile, onTranscriptionComplete }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const hasFetched = useRef(false);

  const transcribe = async (file) => {
    setStatus('loading');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'gpt-4o-beszedtoszoveg');
      formData.append('chunking_strategy', 'auto');

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const text = data.text || JSON.stringify(data, null, 2);
      setTranscript(text);
      if (onTranscriptionComplete) onTranscriptionComplete(text);
      setStatus('success');
    } catch (err) {
      console.error('Transcription failed:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  /* Auto-upload on mount */
  useEffect(() => {
    if (!audioFile) {
      setErrorMsg('No audio recording found. Please go back and record your pitch.');
      setStatus('error');
      return;
    }
    if (hasFetched.current) return;
    hasFetched.current = true;
    transcribe(audioFile);
  }, [audioFile]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page-wrapper">
      <Card className="transcription-card">
        {/* ---- Loading ---- */}
        {status === 'loading' && (
          <motion.div
            className="transcription-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="transcription-spinner-container">
              <motion.div
                className="transcription-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              <FileText size={24} className="transcription-spinner-icon" />
            </div>
            <h2 className="transcription-title">Transcribing your pitch…</h2>
            <p className="transcription-subtitle">
              Sending audio to the AI model. This may take a few seconds.
            </p>
            <div className="transcription-dots">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="transcription-dot"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ---- Success ---- */}
        {status === 'success' && (
          <motion.div
            className="transcription-success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="transcription-success-icon">
              <FileText size={28} />
            </div>
            <h2 className="transcription-title">Your Transcription</h2>
            <div className="transcription-text-container">
              <p className="transcription-text">{transcript}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/analysis')}
            >
              Continue to Analysis
            </Button>
          </motion.div>
        )}

        {/* ---- Error ---- */}
        {status === 'error' && (
          <motion.div
            className="transcription-error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="transcription-error-icon">!</div>
            <h2 className="transcription-title">Transcription Failed</h2>
            <p className="transcription-error-msg">{errorMsg}</p>
            <div className="transcription-error-actions">
              {audioFile && (
                <Button
                  variant="primary"
                  size="md"
                  icon={<RotateCcw size={16} />}
                  onClick={() => {
                    hasFetched.current = false;
                    transcribe(audioFile);
                  }}
                >
                  Retry
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/listening')}
              >
                Record Again
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
