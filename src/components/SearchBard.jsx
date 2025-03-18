import React, { useState } from "react";
import "../styles/SearchBard.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Buscar dispositivo..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
