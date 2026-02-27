import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, toggle }) {
  return (
    <motion.button
      className="theme-toggle"
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </motion.button>
  );
}
