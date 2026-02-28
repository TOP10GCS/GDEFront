import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Square } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Listening.css';

export default function Listening({ onRecordingComplete }) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  /* Start recording on mount */
  useEffect(() => {
    let stream;

    const startRecording = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const ext = mimeType.includes('webm') ? 'webm' : 'mp4';
          const file = new File([blob], `pitch-recording.${ext}`, { type: mimeType });

          /* Pass audio file to parent state */
          onRecordingComplete(file);

          /* Stop all microphone tracks */
          stream.getTracks().forEach((t) => t.stop());

          navigate('/transcription');
        };

        recorder.start(250); // collect data every 250ms
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    };

    startRecording();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Timer */
  useEffect(() => {
    if (!isRecording) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="page-wrapper">
      <Card className="listening-card">
        {/* Microphone */}
        <div className="mic-container">
          <motion.div
            className="mic-ring mic-ring-outer"
            animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="mic-ring mic-ring-mid"
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.05, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="mic-icon-circle"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </motion.div>
        </div>

        <motion.h2
          className="listening-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Listening to your pitch…
        </motion.h2>

        {/* Sound wave bars */}
        <div className="sound-wave">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="sound-bar"
              animate={{
                height: [8, 14 + Math.random() * 28, 8],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.04,
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <motion.div
          className="timer-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {formatTime(seconds)}
        </motion.div>

        <Button
          variant="danger"
          size="lg"
          icon={<Square size={16} />}
          onClick={handleStop}
        >
          Stop Recording
        </Button>
      </Card>
    </div>
  );
}
