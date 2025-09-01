import React from 'react';
import './SearchBar.css';
const SearchBar = ({ value, onChange, placeholder =
"Rechercher..." }) => {
 const handleInputChange = (e) => {
 onChange(e.target.value);
 };
 const clearSearch = () => {
 onChange('');
 };
 return (
 <div className="search-bar">
 <div className="search-input-container">
 <input
 type="text"
value={value}
onChange={handleInputChange}
placeholder={placeholder}
className="search-input"
 />
{value && (
 <button
 onClick={clearSearch}
className="clear-search-btn"
 type="button"
 >
 ✕
 </button>
 )}
 </div>
 </div>
 );
};
export default SearchBar;