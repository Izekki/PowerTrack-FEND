# 📡 Especificación de APIs y Endpoints - PowerTrack

Este documento define las especificaciones técnicas y contratos de comunicación entre el frontend de **PowerTrack** y la API backend.

---

## 📩 Endpoint de Contacto (`/contacto`)

Permite a los usuarios enviar mensajes de soporte técnico o consultas directamente desde la página de contacto (`ContactPage`).

### Detalles del Endpoint
- **Método**: `POST`
- **Ruta**: `/contacto` (o `/contact`)
- **Content-Type**: `application/json`
- **Autenticación**: Opcional / Pública

### Estructura de la Solicitud (Body)
```json
{
  "fullName": "Nombre del Usuario",
  "email": "usuario@ejemplo.com",
  "subject": "Asunto de la consulta",
  "message": "Contenido detallado del mensaje de soporte..."
}
```

### Reglas de Validación Requeridas
- `fullName`: Requerido, string (máx. 120 caracteres).
- `email`: Requerido, formato de correo válido (máx. 160 caracteres).
- `subject`: Requerido, string (máx. 180 caracteres).
- `message`: Requerido, string (máx. 3000 caracteres).

### Respuestas HTTP Esperadas

#### `200 OK` / `201 Created` - Envío Exitoso
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente."
}
```

#### `400 Bad Request` - Error de Validación
```json
{
  "success": false,
  "message": "Los datos proporcionados son inválidos."
}
```

#### `429 Too Many Requests` - Control de Frecuencia (Rate Limit)
```json
{
  "success": false,
  "message": "Ha superado el límite de intentos. Por favor, intente más tarde."
}
```

#### `500 Internal Server Error` - Error del Servidor
```json
{
  "success": false,
  "message": "Ocurrió un problema interno al procesar su solicitud."
}
```
