import { motion } from 'framer-motion';
import './Card.css';

export default function Card({ children, className = '', animate = true, ...props }) {
  const Wrapper = animate ? motion.div : 'div';
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      }
    : {};

  return (
    <Wrapper className={`card ${className}`} {...animateProps} {...props}>
      {children}
    </Wrapper>
  );
}
