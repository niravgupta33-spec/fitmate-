// Login Page (Lectures 55-60: Form handling & validation)
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/common/FormInput';
import { validateForm, validators } from '../utils/validators';
import './Auth.css';

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
    setAuthError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: validationErrors, isValid } = validateForm(values, {
      email: (v) => validators.email(v),
      password: (v) => validators.required(v),
    });

    if (!isValid) { setErrors(validationErrors); return; }

    const result = login(values.email, values.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Log in to your Fitmate account</p>
        </div>

        {authError && <div className="auth-error" role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput id="email" label="Email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
          <FormInput id="password" label="Password" type="password" value={values.password} onChange={handleChange} error={errors.password} placeholder="Enter your password" />
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Log In</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
