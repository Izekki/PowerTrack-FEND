import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [name, setName] = useState(sessionStorage.getItem("name"));

  const login = () => {
    const newUserId = sessionStorage.getItem("userId");
    const newToken = sessionStorage.getItem("token");
    const newName = sessionStorage.getItem("name");
    setUserId(newUserId);
    setToken(newToken);
    setName(newName);
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setToken(null);
    setName(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, token, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
