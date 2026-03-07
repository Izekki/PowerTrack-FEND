import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "./AuthContext";
import { getUserPreferences, updateUserPreferences } from "../utils/services/preferencesService";

const ContrastContext = createContext();

export const ContrastProvider = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, userId } = useAuth();
  const [contrastLevel, setContrastLevel] = useState(() => {
    // Inicializar desde localStorage (cache rápido)
    const saved = localStorage.getItem("contrastLevel");
    return saved || "normal";
  });
  const [loadedUserId, setLoadedUserId] = useState(null);

  // Aplicar estilos visuales cuando cambia el contraste
  useEffect(() => {
    localStorage.setItem("contrastLevel", contrastLevel);
    document.documentElement.setAttribute("data-contrast", contrastLevel);
    
    // Aplicar clase al body para estilos globales
    document.body.classList.remove("contrast-normal", "contrast-high", "contrast-very-high");
    document.body.classList.add(`contrast-${contrastLevel}`);
  }, [contrastLevel]);

  // Limpiar estado visual al cerrar sesión para no heredar configuración entre usuarios
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setContrastLevel("normal");
      setTheme("light");
      setLoadedUserId(null);
      localStorage.removeItem("contrastLevel");
    }
  }, [isAuthenticated, setTheme, userId]);

  /**
   * Carga las preferencias del usuario desde el backend
   * @param {string|number} userId - ID del usuario autenticado
   */
  const loadUserPreferences = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const preferences = await getUserPreferences(userId);
      if (preferences.contrastLevel && preferences.contrastLevel !== contrastLevel) {
        setContrastLevel(preferences.contrastLevel);
      }
      if (preferences.theme && preferences.theme !== theme) {
        setTheme(preferences.theme);
      }
      setLoadedUserId(String(userId));
    } catch (error) {
      console.error("Error cargando preferencias del usuario:", error);
      setLoadedUserId(String(userId));
    }
  }, [contrastLevel, setTheme, theme]);

  /**
   * Cambia el nivel de contraste y lo sincroniza con el backend
   * @param {string} level - Nivel de contraste: "normal" | "high" | "very-high"
   * @param {string|number} [userId] - ID del usuario (opcional, para sincronizar con backend)
   */
  const handleContrastChange = useCallback(async (level, userId = null) => {
    // Actualizar el estado local inmediatamente para UI responsiva
    setContrastLevel(level);

    // Si hay userId, sincronizar con backend
    if (userId) {
      try {
        await updateUserPreferences(userId, { contrastLevel: level });
      } catch (error) {
        console.error("Error sincronizando contraste con backend:", error);
        // No revertir el cambio local si falla el backend
      }
    }
  }, []);

  const handleThemePreferenceChange = useCallback(async (nextTheme, userId = null) => {
    setTheme(nextTheme);

    if (userId) {
      try {
        await updateUserPreferences(userId, { theme: nextTheme });
      } catch (error) {
        console.error("Error sincronizando tema con backend:", error);
      }
    }
  }, [setTheme]);

  const value = useMemo(() => ({
    contrastLevel,
    themePreference: theme === "dark" ? "dark" : "light",
    handleContrastChange,
    handleThemePreferenceChange,
    loadUserPreferences,
    loadedUserId,
  }), [contrastLevel, handleContrastChange, handleThemePreferenceChange, loadUserPreferences, loadedUserId, theme]);

  return (
    <ContrastContext.Provider value={value}>
      {children}
    </ContrastContext.Provider>
  );
};

export const useContrast = () => {
  const context = useContext(ContrastContext);
  if (!context) {
    throw new Error("useContrast must be used within a ContrastProvider");
  }
  return context;
};
