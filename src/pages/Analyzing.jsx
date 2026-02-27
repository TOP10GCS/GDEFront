import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import './Analyzing.css';

export default function Analyzing() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 12 + 3;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => navigate('/results'), 400);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="page-wrapper">
      <Card className="analyzing-card">
        {/* Spinner */}
        <div className="spinner-container">
          <motion.div
            className="spinner-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="spinner-inner">
            <span className="spinner-pct">{Math.round(progress)}%</span>
          </div>
        </div>

        <motion.h2
          className="analyzing-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Analyzing your pitch…
        </motion.h2>

        <motion.p
          className="analyzing-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Our AI is evaluating clarity, confidence, structure, and engagement
          based on your selected preferences.
        </motion.p>

        {/* Progress bar */}
        <div className="analyzing-bar-track">
          <motion.div
            className="analyzing-bar-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Floating dots animation */}
        <div className="analyzing-dots">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="dot"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
