import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import Welcome from './pages/Welcome';
import SettingsPage from './pages/Settings';
import Listening from './pages/Listening';
import Transcription from './pages/Transcription';
import AIAnalysis from './pages/AIAnalysis';
import PageTransition from './components/PageTransition';

export default function App() {
  const location = useLocation();

  /* ---- Theme ---- */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pca-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pca-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  /* ---- Settings state ---- */
  const [settings, setSettings] = useState(null);

  /* ---- Audio recording state ---- */
  const [audioFile, setAudioFile] = useState(null);

  /* ---- Transcription text state ---- */
  const [transcriptionText, setTranscriptionText] = useState('');

  return (
    <>
      <ThemeToggle theme={theme} toggle={toggleTheme} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Welcome />
              </PageTransition>
            }
          />
          <Route
            path="/settings"
            element={
              <PageTransition>
                <SettingsPage onSave={setSettings} />
              </PageTransition>
            }
          />
          <Route
            path="/listening"
            element={
              <PageTransition>
                <Listening onRecordingComplete={setAudioFile} />
              </PageTransition>
            }
          />
          <Route
            path="/transcription"
            element={
              <PageTransition>
                <Transcription
                  audioFile={audioFile}
                  onTranscriptionComplete={setTranscriptionText}
                />
              </PageTransition>
            }
          />
          <Route
            path="/analysis"
            element={
              <PageTransition>
                <AIAnalysis
                  transcriptionText={transcriptionText}
                  settings={settings}
                />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}
