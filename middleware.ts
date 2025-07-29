import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Removed: import { verifyAdminToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`Middleware: Processing request for pathname: ${pathname}`)

  // Protect admin routes (all paths starting with /admin, except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    console.log("Middleware: Protecting admin route.")
    const adminToken = request.cookies.get("admin-token")

    if (!adminToken) {
      console.log("Middleware: Admin token not found, redirecting to login.")
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
    console.log("Middleware: Admin token found, proceeding.")
  }

  // Handle logout API route (clear cookie)
  if (pathname === "/api/admin/logout") {
    console.log("Middleware: Handling logout API route.")
    const response = NextResponse.json({ success: true, message: "Logged out successfully" })
    response.cookies.delete("admin-token") // Clear the admin-token cookie
    return response
  }

  console.log("Middleware: Proceeding with request.")
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/logout"],
}
