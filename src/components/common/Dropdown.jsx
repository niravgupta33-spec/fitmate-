// Dropdown Component (Lectures 61-66)
import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './Common.css';

const Dropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || label;

  return (
    <div className="dropdown" ref={ref}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)} aria-haspopup="true" aria-expanded={isOpen}>
        {selectedLabel} <FiChevronDown />
      </button>
      {isOpen && (
        <div className="dropdown-menu" role="menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`dropdown-item ${value === opt.value ? 'active' : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              role="menuitem"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
