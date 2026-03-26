/**
 * Validaciones de contraseña compartidas entre frontend y backend
 * Usadas para feedback en tiempo real en el RegisterForm
 */

export const passwordRules = [
  {
    id: 'length-min',
    label: 'Mínimo 8 caracteres',
    validate: (password) => password.length >= 8
  },
  {
    id: 'length-max',
    label: 'Máximo 20 caracteres',
    validate: (password) => password.length <= 20
  },
  {
    id: 'no-spaces',
    label: 'Sin espacios',
    validate: (password) => !password.includes(" ")
  },
  {
    id: 'has-number',
    label: 'Contiene al menos un número',
    validate: (password) => /[0-9]/.test(password)
  },
  {
    id: 'has-lowercase',
    label: 'Letra minúscula',
    validate: (password) => /[a-záéíóúñ]/.test(password)
  },
  {
    id: 'has-uppercase',
    label: 'Letra mayúscula',
    validate: (password) => /[A-ZÁÉÍÓÚÑ]/.test(password)
  },
  {
    id: 'no-repeated-chars',
    label: 'No más de 2 caracteres iguales seguidos',
    validate: (password) => !/(\w)\1{2,}/.test(password)
  },
  {
    id: 'valid-chars',
    label: 'Solo caracteres válidos (letras, números, !@#$%^&*/)',
    validate: (password) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9!@#$%^&/*]+$/.test(password)
  },
  {
    id: 'no-common-patterns',
    label: 'Sin patrones comunes (12345, password)',
    validate: (password) => !/12345|password/i.test(password)
  }
];

/**
 * Valida una contraseña completa y retorna array de errores
 * @param {string} password - La contraseña a validar
 * @returns {string[]} Array de mensajes de error (vacío si es válida)
 */
export const validatePassword = (password) => {
  if (typeof password !== 'string') return ["La contraseña debe ser una cadena de texto"];
  
  const errors = [];
  
  const failedRules = passwordRules.filter(rule => !rule.validate(password));
  
  return failedRules.map(rule => rule.label);
};

/**
 * Retorna el estado de validación de cada regla
 * @param {string} password - La contraseña a validar
 * @returns {Object} Objeto con el estado de cada regla
 */
export const getPasswordValidationStatus = (password) => {
  return passwordRules.reduce((acc, rule) => {
    acc[rule.id] = rule.validate(password);
    return acc;
  }, {});
};

/**
 * Verifica si la contraseña es completamente válida
 * @param {string} password - La contraseña a validar
 * @returns {boolean} true si es válida, false si no
 */
export const isPasswordValid = (password) => {
  if (typeof password !== 'string') return false;
  return passwordRules.every(rule => rule.validate(password));
};
