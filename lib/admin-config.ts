export const ADMIN_EMAILS = [
  "francolafitte@gmail.com",
  "nachofabiano40@gmail.com",
]

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? ""
}

export function isAdminEmail(email?: string | null) {
  return ADMIN_EMAILS.some((allowed) => normalizeEmail(allowed) === normalizeEmail(email))
}
