import React, { useState } from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Maneja el cambio en el input
  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setQuery("");
    onSearch(""); // Asegurar que se reinicia la búsqueda
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
      {query && <button className="clear-btn" onClick={clearSearch}>✖</button>}
    </div>
  );
};

export default SearchBar;
