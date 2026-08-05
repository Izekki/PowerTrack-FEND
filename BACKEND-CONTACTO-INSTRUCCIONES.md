# Instrucciones Backend - Endpoint de Contacto

## Contexto
En frontend ya existe una pagina de contacto (`ContactPage`) para que el usuario envie:
- `fullName`
- `email`
- `subject`
- `message`

El objetivo es enviar estos datos al correo de soporte: `powertrack2025@gmail.com` sin usar `mailto` ni abrir aplicaciones externas.

## Objetivo tecnico
Implementar un endpoint de backend para recibir el formulario y disparar el envio de correo.

## Requisito clave
Si ya se cuenta con un servicio actualmente, aprovechalo para realizar este `POST`.
No dupliques logica ni crees un servicio paralelo si ya existe infraestructura de envio de correos/mensajeria.

## Endpoint esperado
- Metodo: `POST`
- Ruta sugerida: `/contacto` (o `/contact`, mantener consistencia con el proyecto)
- Content-Type: `application/json`

### Body esperado
```json
{
  "fullName": "Nombre Apellido",
  "email": "usuario@dominio.com",
  "subject": "Asunto del mensaje",
  "message": "Contenido del mensaje"
}
```

## Validaciones minimas
1. Todos los campos son requeridos.
2. Validar formato de correo (`email`).
3. Limitar longitud maxima razonable para evitar abuso:
- `fullName`: 120
- `email`: 160
- `subject`: 180
- `message`: 3000
4. Sanitizar/normalizar entrada (trim, evitar payload vacio).

## Logica de envio
- Enviar correo destino a `powertrack2025@gmail.com`.
- Incluir en el cuerpo:
- Nombre completo
- Correo de contacto del usuario
- Asunto
- Mensaje
- Fecha/hora de recepcion

## Respuestas API sugeridas
- `200` o `201`:
```json
{ "success": true, "message": "Mensaje enviado correctamente" }
```

- `400` (validacion):
```json
{ "success": false, "message": "Datos invalidos" }
```

- `429` (rate limit, si aplica):
```json
{ "success": false, "message": "Demasiadas solicitudes, intenta mas tarde" }
```

- `500` (error interno/envio):
```json
{ "success": false, "message": "No fue posible enviar el mensaje" }
```

## Seguridad y robustez
- No exponer credenciales en respuestas ni logs.
- Usar variables de entorno para secretos (API key/SMTP user/password).
- Agregar rate limiting para el endpoint de contacto.
- Si el proyecto ya tiene middleware de validacion, logging o manejo de errores, reutilizarlo.

## Entregables del agente backend
1. Endpoint funcional de `POST` para contacto.
2. Integracion con servicio de envio existente (o crear uno solo si no existe).
3. Validaciones y manejo de errores consistentes con la API actual.
4. Ejemplo de request/response en la documentacion interna.
5. Nota de variables de entorno requeridas.

## Nota para integracion frontend
Una vez listo, frontend consumira este endpoint para evitar el flujo `mailto` y mantener todo dentro de la app.
