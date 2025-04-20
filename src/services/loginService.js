export const loginUser = async (formData) => {
    try {
      const response = await fetch('http://localhost:5051/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Error al iniciar sesión' };
      }
    } catch {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };
  