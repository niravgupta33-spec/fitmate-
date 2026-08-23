// SearchBar Component with Debounce (Lectures 61-66, 67-72)
import { FiSearch } from 'react-icons/fi';
import './Common.css';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        id="search-input"
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
