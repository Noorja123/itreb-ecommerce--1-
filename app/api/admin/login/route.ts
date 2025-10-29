export async function POST(request: Request) {
  const { email, password } = await request.json()

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@itrebindia"
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345"

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return Response.json({
      token: "admin-token-" + Date.now(),
      message: "Login successful",
    })
  }

  return Response.json({ message: "Invalid credentials" }, { status: 401 })
}
