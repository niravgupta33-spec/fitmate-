// Toast Container Component (Lectures 61-66)
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import './Common.css';

const iconMap = {
  success: <FiCheckCircle style={{ color: 'var(--color-accent)' }} />,
  error: <FiXCircle style={{ color: 'var(--color-danger)' }} />,
  warning: <FiAlertTriangle style={{ color: 'var(--color-warning)' }} />,
  info: <FiInfo style={{ color: 'var(--color-info)' }} />,
};

const Toast = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          <span className="toast-icon">{iconMap[t.type]}</span>
          <span>{t.message}</span>
          <button className="toast-dismiss" onClick={() => removeToast(t.id)} aria-label="Dismiss"><FiX /></button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
