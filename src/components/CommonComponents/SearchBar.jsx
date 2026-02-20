import React, { useState } from "react";
import "../../styles/CommonComponentsCss/SearchBar.css";
import searchIcon from "../../assets/search-icon.svg";

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
      <img src={searchIcon} alt="Buscar" />
      <input
        type="text"
        placeholder="Buscar dispositivo o grupo..."
        value={query}
        onChange={handleSearch}
      />
      {query && <button className="clear-btn" onClick={clearSearch}>✖</button>}
    </div>
  );
};

export default SearchBar;
