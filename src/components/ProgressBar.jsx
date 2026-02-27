import { motion } from 'framer-motion';
import './ProgressBar.css';

export default function ProgressBar({ label, value, color, delay = 0 }) {
  const barColor = color || 'var(--accent)';

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}%</span>
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
