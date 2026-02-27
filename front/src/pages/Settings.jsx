import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings2, Mic } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import RadioGroup from '../components/RadioGroup';
import Select from '../components/Select';
import Slider from '../components/Slider';
import './Settings.css';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage({ onSave }) {
  const navigate = useNavigate();

  const [goal, setGoal] = useState('Startup Pitch');
  const [formality, setFormality] = useState('Semi-formal');
  const [situation, setSituation] = useState('Demo Day');
  const [location, setLocation] = useState('Small Room');
  const [time, setTime] = useState(5);

  const handleStart = () => {
    onSave({ goal, formality, situation, location, time });
    navigate('/listening');
  };

  return (
    <div className="page-wrapper top-align">
      <motion.div
        className="settings-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="settings-icon-ring">
          <Settings2 size={24} />
        </div>
        <h1 className="settings-title">Configure Your Session</h1>
        <p className="settings-subtitle">
          Customize the simulation to match your real-world scenario.
        </p>
      </motion.div>

      <motion.div
        className="settings-grid"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Goal */}
        <motion.div variants={item}>
          <Card className="compact">
            <RadioGroup
              label="🎯 Goal"
              name="goal"
              options={['Startup Pitch', 'Job Interview', 'University Lecture']}
              value={goal}
              onChange={setGoal}
            />
          </Card>
        </motion.div>

        {/* Formality */}
        <motion.div variants={item}>
          <Card className="compact">
            <RadioGroup
              label="👔 Formality"
              name="formality"
              options={['Casual', 'Semi-formal', 'Formal']}
              value={formality}
              onChange={setFormality}
            />
          </Card>
        </motion.div>

        {/* Situation */}
        <motion.div variants={item}>
          <Card className="compact">
            <Select
              label="📍 Situation"
              options={['Demo Day', 'Board Meeting', 'Classroom', 'Conference Stage']}
              value={situation}
              onChange={setSituation}
            />
          </Card>
        </motion.div>

        {/* Location */}
        <motion.div variants={item}>
          <Card className="compact">
            <RadioGroup
              label="🏛 Location"
              name="location"
              options={['Small Room', 'Big Conference Room', 'Stage']}
              value={location}
              onChange={setLocation}
            />
          </Card>
        </motion.div>

        {/* Time */}
        <motion.div variants={item} className="settings-full-width">
          <Card className="compact">
            <Slider
              label="⏱ Time Constraint"
              value={time}
              min={1}
              max={15}
              unit=" min"
              onChange={setTime}
            />
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="settings-action"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <Button
          variant="primary"
          size="lg"
          icon={<Mic size={18} />}
          onClick={handleStart}
        >
          Start Pitch Session
        </Button>
      </motion.div>
    </div>
  );
}
