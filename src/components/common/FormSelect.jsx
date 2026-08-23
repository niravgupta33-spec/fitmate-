// Reusable FormSelect Component (Lectures 55-60)
import './Common.css';

const FormSelect = ({ label, id, value, onChange, options = [], error, placeholder, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <select
        id={id}
        className={`form-input form-select ${error ? 'form-input-error' : ''}`}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="form-error" role="alert">{error}</span>}
    </div>
  );
};

export default FormSelect;
