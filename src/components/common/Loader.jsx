// Loader Component
import './Common.css';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={fullPage ? 'loader-page' : 'loader-container'}>
      <div className="loader" role="status" aria-label="Loading"></div>
    </div>
  );
};

export default Loader;
