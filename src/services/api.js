// api.js

const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetchData = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers, // Para que puedas añadir otros headers si es necesario
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }

  return response.json();
};

export default fetchData;
