// Register Page (Lectures 55-60: Form handling & validation)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/common/FormInput';
import { validateForm, validators } from '../utils/validators';
import './Auth.css';

const Register = () => {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
    setAuthError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: validationErrors, isValid } = validateForm(values, {
      name: (v) => validators.name(v),
      email: (v) => validators.email(v),
      password: (v) => validators.password(v),
      confirmPassword: (v, all) => validators.confirmPassword(v, all.password),
    });

    if (!isValid) { setErrors(validationErrors); return; }

    const result = register(values.name, values.email, values.password);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setAuthError(result.error);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start your fitness journey with Fitmate</p>
        </div>

        {authError && <div className="auth-error" role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput id="name" label="Full Name" value={values.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
          <FormInput id="email" label="Email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
          <FormInput id="password" label="Password" type="password" value={values.password} onChange={handleChange} error={errors.password} placeholder="Min 6 characters" />
          <FormInput id="confirmPassword" label="Confirm Password" type="password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Repeat password" />
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Create Account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
