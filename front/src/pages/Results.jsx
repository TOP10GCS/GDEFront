import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, RefreshCw, Trophy, TrendingUp, MessageSquareText } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import './Results.css';

/* ---- Feedback bank ---- */
const feedbackBank = [
  'Your pitch demonstrated strong clarity and maintained good pacing throughout.',
  'Excellent confidence level — your tone was assertive yet approachable.',
  'Consider tightening the introduction to hook your audience earlier.',
  'Your structure followed a clear narrative arc, making it easy to follow.',
  'The closing statement was impactful; it left a memorable impression.',
  'Engagement was high — you varied your vocal dynamics effectively.',
  'Persuasiveness was solid, though adding a concrete case study could help.',
  'Your use of pauses added weight to key points — very effective.',
  'Try reducing filler words to improve overall polish.',
  'Your tone matched the selected formality very well.',
  'Great eye-contact simulation cues — your delivery felt personal.',
  'Adding a question to the audience mid-pitch could boost interaction.',
  'You demonstrated strong domain knowledge, which built credibility.',
  'The pacing in the middle section could be tightened for more impact.',
  'Overall, a professional and well-structured delivery. Keep refining!',
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateResults() {
  const overall = rand(60, 98);
  const metrics = [
    { label: 'Confidence', value: rand(50, 100), color: '#6366f1' },
    { label: 'Clarity', value: rand(50, 100), color: '#8b5cf6' },
    { label: 'Engagement', value: rand(50, 100), color: '#a78bfa' },
    { label: 'Structure', value: rand(50, 100), color: '#22c55e' },
    { label: 'Persuasiveness', value: rand(50, 100), color: '#f59e0b' },
  ];
  const feedback = pickRandom(feedbackBank, rand(3, 5));
  return { overall, metrics, feedback };
}

function scoreBadgeVariant(score) {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'danger';
}

export default function Results({ settings }) {
  const navigate = useNavigate();
  const [data, setData] = useState(generateResults);
  const [history, setHistory] = useState([]);

  // Save to history on each new generation
  useEffect(() => {
    setHistory((h) => [...h, data]);
  }, [data]);

  const regenerate = useCallback(() => {
    setData(generateResults());
  }, []);

  return (
    <div className="page-wrapper top-align">
      {/* Header */}
      <motion.div
        className="results-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy size={28} className="results-header-icon" />
        <h1 className="results-title">Your Pitch Results</h1>
        {settings && (
          <p className="results-context">
            {settings.goal} • {settings.formality} • {settings.situation}
          </p>
        )}
      </motion.div>

      {/* Score */}
      <motion.div
        className="score-section"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
      >
        <Badge variant={scoreBadgeVariant(data.overall)} size="xl">
          {data.overall}
        </Badge>
        <span className="score-label">Overall Score</span>
      </motion.div>

      {/* Metrics */}
      <Card className="metrics-card">
        <div className="metrics-card-header">
          <TrendingUp size={18} />
          <span>Performance Metrics</span>
        </div>
        {data.metrics.map((m, i) => (
          <ProgressBar key={m.label} label={m.label} value={m.value} color={m.color} delay={0.1 * i} />
        ))}
      </Card>

      {/* Feedback */}
      <Card className="feedback-card">
        <div className="feedback-card-header">
          <MessageSquareText size={18} />
          <span>AI Feedback</span>
        </div>
        <ul className="feedback-list">
          {data.feedback.map((line, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
            >
              {line}
            </motion.li>
          ))}
        </ul>
      </Card>

      {/* History mini-chart */}
      {history.length > 1 && (
        <Card className="history-card compact">
          <div className="history-header">📈 Score History</div>
          <div className="history-chart">
            {history.map((h, i) => (
              <motion.div
                key={i}
                className="history-bar-wrapper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="history-bar-value">{h.overall}</span>
                <div
                  className="history-bar"
                  style={{ height: `${h.overall}%` }}
                />
                <span className="history-bar-label">#{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="results-actions">
        <Button
          variant="primary"
          size="md"
          icon={<RotateCcw size={16} />}
          onClick={() => navigate('/settings')}
        >
          Retry Simulation
        </Button>
        <Button
          variant="secondary"
          size="md"
          icon={<RefreshCw size={16} />}
          onClick={regenerate}
        >
          New Random Analysis
        </Button>
      </div>
    </div>
  );
}
