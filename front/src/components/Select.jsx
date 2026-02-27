import './Select.css';

export default function Select({ label, options, value, onChange }) {
  return (
    <div className="select-container">
      {label && <label className="select-label">{label}</label>}
      <div className="select-wrapper">
        <select
          className="select-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <span className="select-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
