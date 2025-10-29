import crypto from "crypto"

const ADMIN_EMAIL = "admin@itrebindia"
const ADMIN_PASSWORD = "12345"

// Hash password using SHA256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export function getAdminPasswordHash(): string {
  return hashPassword(ADMIN_PASSWORD)
}
