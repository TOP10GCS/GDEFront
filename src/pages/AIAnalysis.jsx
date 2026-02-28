import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, ThumbsUp, AlertTriangle,
  MessageSquareText, RotateCcw, Mic, Brain,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import './AIAnalysis.css';

/*
 * ⚠️ For production, move API calls to a backend server.
 * Direct frontend calls are acceptable for demo / MVP only.
 */

const API_ENDPOINT =
  'https://teamgcs.cognitiveservices.azure.com/openai/deployments/gpt-4o-szovegelemzes/chat/completions?api-version=2025-01-01-preview';

function scoreBadgeVariant(score) {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'danger';
}

export default function AIAnalysis({ transcriptionText, settings }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const hasFetched = useRef(false);

  const analyze = async () => {
    setStatus('loading');
    setErrorMsg('');

    const { goal, formality, situation, location, time } = settings || {};

    const requestBody = {
      messages: [
        {
          role: 'system',
          content: `You are a professional public speaking and pitch evaluation expert.

Analyze the user's speech based on:
- Goal
- Formality
- Situation
- Location
- Time constraint

Return ONLY valid JSON in this format:

{
  "overallScore": number (0-100),
  "confidence": number (0-100),
  "clarity": number (0-100),
  "engagement": number (0-100),
  "structure": number (0-100),
  "persuasiveness": number (0-100),
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "detailedFeedback": "string paragraph"
}

Do not include explanations outside JSON.`,
        },
        {
          role: 'user',
          content: `Speech text:
"${transcriptionText}"

Settings:
Goal: ${goal || 'N/A'}
Formality: ${formality || 'N/A'}
Situation: ${situation || 'N/A'}
Location: ${location || 'N/A'}
Time Limit: ${time || 'N/A'} minutes`,
        },
      ],
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1,
      model: 'gpt-4o-szovegelemzes',
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_AZURE_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const aiText = data.choices?.[0]?.message?.content;

      if (!aiText) throw new Error('Empty response from AI model.');

      // Strip markdown code fences if present
      const cleaned = aiText.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setAnalysis(parsed);
      setStatus('success');
    } catch (err) {
      console.error('AI analysis failed:', err);
      if (err instanceof SyntaxError) {
        setErrorMsg('AI response format error — could not parse JSON.');
      } else {
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
      }
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!transcriptionText) {
      setErrorMsg('No transcription text found. Please go back and record your pitch.');
      setStatus('error');
      return;
    }
    if (!settings) {
      setErrorMsg('No session settings found. Please configure your session first.');
      setStatus('error');
      return;
    }
    if (hasFetched.current) return;
    hasFetched.current = true;
    analyze();
  }, [transcriptionText, settings]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Metrics helper ---- */
  const metrics = analysis
    ? [
        { label: 'Confidence', value: analysis.confidence, color: '#6366f1' },
        { label: 'Clarity', value: analysis.clarity, color: '#8b5cf6' },
        { label: 'Engagement', value: analysis.engagement, color: '#a78bfa' },
        { label: 'Structure', value: analysis.structure, color: '#22c55e' },
        { label: 'Persuasiveness', value: analysis.persuasiveness, color: '#f59e0b' },
      ]
    : [];

  return (
    <div className="page-wrapper top-align">
      {/* ---- Loading ---- */}
      {status === 'loading' && (
        <Card className="analysis-loading-card">
          <motion.div
            className="analysis-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="analysis-spinner-container">
              <motion.div
                className="analysis-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              <Brain size={28} className="analysis-spinner-icon" />
            </div>
            <h2 className="analysis-loading-title">Analyzing your pitch…</h2>
            <p className="analysis-loading-sub">
              GPT-4o is evaluating clarity, confidence, structure, and engagement
              based on your settings.
            </p>
            <div className="analysis-dots">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="analysis-dot"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        </Card>
      )}

      {/* ---- Success ---- */}
      {status === 'success' && analysis && (
        <>
          {/* Header */}
          <motion.div
            className="analysis-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Trophy size={28} className="analysis-header-icon" />
            <h1 className="analysis-title">AI Pitch Analysis</h1>
            {settings && (
              <p className="analysis-context">
                {settings.goal} · {settings.formality} · {settings.situation}
              </p>
            )}
          </motion.div>

          {/* Overall Score */}
          <motion.div
            className="score-section"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
          >
            <Badge variant={scoreBadgeVariant(analysis.overallScore)} size="xl">
              {analysis.overallScore}
            </Badge>
            <span className="score-label">Overall Score</span>
          </motion.div>

          {/* Metrics */}
          <Card className="analysis-metrics-card">
            <div className="analysis-section-header">
              <TrendingUp size={18} />
              <span>Performance Metrics</span>
            </div>
            {metrics.map((m, i) => (
              <ProgressBar
                key={m.label}
                label={m.label}
                value={m.value}
                color={m.color}
                delay={0.1 * i}
              />
            ))}
          </Card>

          {/* Strengths & Improvements */}
          <div className="analysis-two-col">
            <Card className="analysis-list-card compact">
              <div className="analysis-section-header success-header">
                <ThumbsUp size={18} />
                <span>Strengths</span>
              </div>
              <ul className="analysis-list strengths-list">
                {(analysis.strengths || []).map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </Card>

            <Card className="analysis-list-card compact">
              <div className="analysis-section-header warning-header">
                <AlertTriangle size={18} />
                <span>Areas to Improve</span>
              </div>
              <ul className="analysis-list improvements-list">
                {(analysis.improvements || []).map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <Card className="analysis-feedback-card">
            <div className="analysis-section-header">
              <MessageSquareText size={18} />
              <span>Detailed Feedback</span>
            </div>
            <motion.p
              className="analysis-feedback-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {analysis.detailedFeedback}
            </motion.p>
          </Card>

          {/* Actions */}
          <div className="analysis-actions">
            <Button
              variant="primary"
              size="md"
              icon={<RotateCcw size={16} />}
              onClick={() => navigate('/settings')}
            >
              Retry Pitch
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Mic size={16} />}
              onClick={() => navigate('/listening')}
            >
              Record Again
            </Button>
          </div>
        </>
      )}

      {/* ---- Error ---- */}
      {status === 'error' && (
        <Card className="analysis-loading-card">
          <motion.div
            className="analysis-error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="analysis-error-icon">!</div>
            <h2 className="analysis-loading-title">Analysis Failed</h2>
            <p className="analysis-error-msg">{errorMsg}</p>
            <div className="analysis-error-actions">
              {transcriptionText && settings && (
                <Button
                  variant="primary"
                  size="md"
                  icon={<RotateCcw size={16} />}
                  onClick={() => {
                    hasFetched.current = false;
                    analyze();
                  }}
                >
                  Retry
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/settings')}
              >
                Back to Settings
              </Button>
            </div>
          </motion.div>
        </Card>
      )}
    </div>
  );
}
