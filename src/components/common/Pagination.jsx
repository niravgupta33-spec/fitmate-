// Pagination Component (Lectures 67-72)
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Common.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"><FiChevronLeft /></button>
      {getPages().map((p) => (
        <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => onPageChange(p)} aria-current={p === currentPage ? 'page' : undefined}>{p}</button>
      ))}
      <button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page"><FiChevronRight /></button>
    </nav>
  );
};

export default Pagination;
