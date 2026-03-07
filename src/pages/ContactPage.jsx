import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ContactPage.css";
import { sendContactMessage } from "../utils/services/contactService";
import { CONTACT_LIMITS, validateContactForm } from "../utils/contactValidation";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";

const ContactPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactState, setContactState] = useState({
    type: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbItems = [
    { label: "Configuracion", onClick: () => navigate("/configuracion") },
    { label: "Contacto", active: true },
  ];

  const handleContactInputChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (contactState.message) {
      setContactState({ type: "", message: "" });
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleContactBlur = (event) => {
    const { name } = event.target;
    const validation = validateContactForm(contactForm);

    if (validation.errors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name],
      }));
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const validation = validateContactForm(contactForm);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setContactState({
        type: "error",
        message: "Revisa los campos marcados antes de enviar.",
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await sendContactMessage(validation.sanitizedData);

      setContactState({
        type: "success",
        message: response?.message || "Mensaje enviado correctamente.",
      });

      setContactForm({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      if (error.status === 429) {
        setContactState({
          type: "error",
          message:
            "Has alcanzado el limite de mensajes. Espera unos minutos antes de intentarlo de nuevo.",
        });
      } else if (error.status === 400) {
        setContactState({
          type: "error",
          message: error.message || "Datos invalidos. Revisa el formulario.",
        });
      } else if (error.status === 500) {
        setContactState({
          type: "error",
          message:
            "No fue posible enviar el mensaje. Intentalo nuevamente en unos minutos.",
        });
      } else {
        setContactState({
          type: "error",
          message: error.message || "Error de conexion. Verifica tu red.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCounterClassName = (currentLength, maxLength) => {
    const percentage = (currentLength / maxLength) * 100;

    if (percentage >= 95) {
      return "is-danger";
    }

    if (percentage >= 80) {
      return "is-warning";
    }

    return "";
  };

  return (
    <div className="contactPage-container">
      <div className="contactPage-content">
        <div className="breadcrumb-topbar">
          <Breadcrumb items={breadcrumbItems} />
          <div className="breadcrumb-actions">
            <BackButton onClick={() => navigate("/configuracion")} label="Volver" />
          </div>
        </div>

        <section className="contactPage-card" aria-live="polite">
          <h2 className="contactPage-title">Contactanos</h2>
          <p className="contactPage-description">
            Envia tu mensaje y lo procesaremos directamente desde la plataforma hacia
            <strong> powertrack2025@gmail.com</strong>.
          </p>

          {contactState.message && (
            <p className={`contactPage-status ${contactState.type === "error" ? "is-error" : "is-success"}`}>
              {contactState.message}
            </p>
          )}

          <form className="contactPage-form" onSubmit={handleContactSubmit}>
            <div className="contactPage-fieldGroup">
              <label className="contactPage-label" htmlFor="contact-fullName">
                Nombre completo
              </label>
              <input
                id="contact-fullName"
                name="fullName"
                type="text"
                className={`contactPage-input ${fieldErrors.fullName ? "is-invalid" : ""}`}
                value={contactForm.fullName}
                onChange={handleContactInputChange}
                onBlur={handleContactBlur}
                placeholder="Ej. Ana Torres"
                maxLength={CONTACT_LIMITS.fullName}
                disabled={isSubmitting}
                required
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? "contact-fullName-error" : undefined}
              />
              {fieldErrors.fullName && (
                <span id="contact-fullName-error" className="contactPage-errorText">
                  {fieldErrors.fullName}
                </span>
              )}
              <span className={`contactPage-counter ${getCounterClassName(contactForm.fullName.length, CONTACT_LIMITS.fullName)}`}>
                {contactForm.fullName.length}/{CONTACT_LIMITS.fullName}
              </span>
            </div>

            <div className="contactPage-fieldGroup">
              <label className="contactPage-label" htmlFor="contact-email">
                Correo electronico
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className={`contactPage-input ${fieldErrors.email ? "is-invalid" : ""}`}
                value={contactForm.email}
                onChange={handleContactInputChange}
                onBlur={handleContactBlur}
                placeholder="tunombre@correo.com"
                maxLength={CONTACT_LIMITS.email}
                disabled={isSubmitting}
                required
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
              />
              {fieldErrors.email && (
                <span id="contact-email-error" className="contactPage-errorText">
                  {fieldErrors.email}
                </span>
              )}
              <span className={`contactPage-counter ${getCounterClassName(contactForm.email.length, CONTACT_LIMITS.email)}`}>
                {contactForm.email.length}/{CONTACT_LIMITS.email}
              </span>
            </div>

            <div className="contactPage-fieldGroup">
              <label className="contactPage-label" htmlFor="contact-subject">
                Asunto
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                className={`contactPage-input ${fieldErrors.subject ? "is-invalid" : ""}`}
                value={contactForm.subject}
                onChange={handleContactInputChange}
                onBlur={handleContactBlur}
                placeholder="Soporte tecnico"
                maxLength={CONTACT_LIMITS.subject}
                disabled={isSubmitting}
                required
                aria-invalid={Boolean(fieldErrors.subject)}
                aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
              />
              {fieldErrors.subject && (
                <span id="contact-subject-error" className="contactPage-errorText">
                  {fieldErrors.subject}
                </span>
              )}
              <span className={`contactPage-counter ${getCounterClassName(contactForm.subject.length, CONTACT_LIMITS.subject)}`}>
                {contactForm.subject.length}/{CONTACT_LIMITS.subject}
              </span>
            </div>

            <div className="contactPage-fieldGroup">
              <label className="contactPage-label" htmlFor="contact-message">
                Mensaje
              </label>
              <textarea
                id="contact-message"
                name="message"
                className={`contactPage-textarea ${fieldErrors.message ? "is-invalid" : ""}`}
                value={contactForm.message}
                onChange={handleContactInputChange}
                onBlur={handleContactBlur}
                placeholder="Cuentanos en que te podemos ayudar"
                rows={6}
                maxLength={CONTACT_LIMITS.message}
                disabled={isSubmitting}
                required
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
              />
              {fieldErrors.message && (
                <span id="contact-message-error" className="contactPage-errorText">
                  {fieldErrors.message}
                </span>
              )}
              <span className={`contactPage-counter ${getCounterClassName(contactForm.message.length, CONTACT_LIMITS.message)}`}>
                {contactForm.message.length}/{CONTACT_LIMITS.message}
              </span>
            </div>

            <button type="submit" className="contactPage-submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
