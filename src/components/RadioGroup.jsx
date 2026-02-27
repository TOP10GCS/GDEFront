import './RadioGroup.css';

export default function RadioGroup({ label, options, value, onChange, name }) {
  return (
    <div className="radio-group">
      {label && <span className="radio-group-label">{label}</span>}
      <div className="radio-options">
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isActive = value === optValue;

          return (
            <label
              key={optValue}
              className={`radio-option ${isActive ? 'active' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={optValue}
                checked={isActive}
                onChange={() => onChange(optValue)}
              />
              <span className="radio-option-text">{optLabel}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
