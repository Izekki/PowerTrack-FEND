export const CONTACT_LIMITS = {
  fullName: 120,
  email: 160,
  subject: 180,
  message: 3000,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeFormData = (formData = {}) => ({
  fullName: (formData.fullName || "").trim(),
  email: (formData.email || "").trim(),
  subject: (formData.subject || "").trim(),
  message: (formData.message || "").trim(),
});

export const validateContactForm = (formData) => {
  const values = normalizeFormData(formData);
  const errors = {};

  if (!values.fullName) {
    errors.fullName = "El nombre es obligatorio";
  } else if (values.fullName.length > CONTACT_LIMITS.fullName) {
    errors.fullName = `El nombre no puede exceder ${CONTACT_LIMITS.fullName} caracteres`;
  }

  if (!values.email) {
    errors.email = "El correo electronico es obligatorio";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Correo electronico invalido";
  } else if (values.email.length > CONTACT_LIMITS.email) {
    errors.email = `El correo no puede exceder ${CONTACT_LIMITS.email} caracteres`;
  }

  if (!values.subject) {
    errors.subject = "El asunto es obligatorio";
  } else if (values.subject.length > CONTACT_LIMITS.subject) {
    errors.subject = `El asunto no puede exceder ${CONTACT_LIMITS.subject} caracteres`;
  }

  if (!values.message) {
    errors.message = "El mensaje es obligatorio";
  } else if (values.message.length > CONTACT_LIMITS.message) {
    errors.message = `El mensaje no puede exceder ${CONTACT_LIMITS.message} caracteres`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: values,
  };
};
