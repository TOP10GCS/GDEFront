import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <Card className="welcome-card">
        {/* Glow accent */}
        <div className="welcome-glow" />

        <motion.div
          className="welcome-icon-ring"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
        >
          <Mic size={32} />
        </motion.div>

        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          Pitch Analyzer
        </motion.h1>

        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Practice your pitch. Get AI-powered feedback. Improve instantly.
        </motion.p>

        <motion.p
          className="welcome-desc"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          Pitch Analyzer is an intelligent simulator that listens to your pitch,
          analyzes clarity, confidence, structure, and engagement—then delivers
          actionable feedback in seconds. No sign-up required. Just speak and learn.
        </motion.p>

        <motion.div
          className="welcome-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <div className="feature-chip">🎯 Real-time Analysis</div>
          <div className="feature-chip">🧠 AI Feedback</div>
          <div className="feature-chip">📊 Detailed Metrics</div>
          <div className="feature-chip">⚡ Instant Results</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            onClick={() => navigate('/settings')}
          >
            Start Simulation
          </Button>
        </motion.div>
      </Card>
    </div>
  );
}
