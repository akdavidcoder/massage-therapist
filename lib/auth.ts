import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    console.log("verifyAdminToken: Token found in request cookies:", !!token) // Log if token exists

    if (!token) {
      console.log("verifyAdminToken: No token found.")
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    console.log("verifyAdminToken: Token decoded successfully for adminId:", decoded.adminId)
    return decoded
  } catch (error) {
    console.error("verifyAdminToken: Token verification failed:", error)
    return null
  }
}

export function requireAdmin(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const admin = verifyAdminToken(request)

    if (!admin) {
      console.log("requireAdmin: Unauthorized access, returning 401.")
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(request, ...args)
  }
}
