// Reusable FormInput Component (Lectures 55-60)
import './Common.css';

const FormInput = ({ label, id, type = 'text', value, onChange, error, placeholder, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && <span id={`${id}-error`} className="form-error" role="alert">{error}</span>}
    </div>
  );
};

export default FormInput;
