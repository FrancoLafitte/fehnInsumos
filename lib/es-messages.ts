const translations: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "Credenciales inválidas."],
  [/email not confirmed/i, "Tu correo todavía no fue confirmado."],
  [/user already registered/i, "Ya existe una cuenta con ese email."],
  [/user already exists/i, "Ya existe una cuenta con ese email."],
  [/signup requires a valid password/i, "La contraseña no es válida."],
  [/password should be at least/i, "La contraseña debe tener al menos 6 caracteres."],
  [/passwords do not match/i, "Las contraseñas no coinciden."],
  [/invalid email/i, "El email ingresado no es válido."],
  [/unable to validate email address/i, "El email ingresado no es válido."],
  [/email.*required/i, "El email es obligatorio."],
  [/password.*required/i, "La contraseña es obligatoria."],
  [/required.*email/i, "El email es obligatorio."],
  [/required.*password/i, "La contraseña es obligatoria."],
  [/not found/i, "No se encontró el registro solicitado."],
  [/forbidden/i, "No tenés permisos para realizar esta acción."],
  [/unauthorized/i, "No estás autorizado para realizar esta acción."],
  [/network/i, "Hubo un problema de conexión. Intentá nuevamente."],
  [/failed to fetch/i, "No se pudo conectar con el servidor."],
  [/too many requests/i, "Demasiados intentos. Intentá más tarde."],
  [/rate limit/i, "Demasiados intentos. Intentá más tarde."],
  [/duplicate key/i, "Ya existe un registro con esos datos."],
  [/cannot be blank/i, "Este campo no puede quedar vacío."],
  [/missing/i, "Faltan datos obligatorios."],
]

export function normalizeUserMessage(message?: string | null, fallback = "Ocurrió un error.") {
  if (!message) return fallback

  const trimmed = String(message).trim()
  if (!trimmed) return fallback

  const translated = translations.find(([pattern]) => pattern.test(trimmed))
  if (translated) return translated[1]

  return trimmed
}
