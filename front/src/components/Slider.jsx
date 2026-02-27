import './Slider.css';

export default function Slider({ label, value, min = 1, max = 15, step = 1, onChange, unit = '' }) {
  return (
    <div className="slider-container">
      {label && <label className="slider-label">{label}</label>}
      <div className="slider-value-display">
        <span className="slider-current">{value}{unit}</span>
      </div>
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          '--pct': `${((value - min) / (max - min)) * 100}%`,
        }}
      />
      <div className="slider-range-labels">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
