import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    const admin = token ? await verifyToken(token) : null

    if (!admin) {
      console.log("API /api/admin/me: Unauthorized - No admin token or invalid token.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("massage_therapy")

    // The token contains username, not adminId
    const username = (admin as any).username
    console.log("API /api/admin/me: Querying for admin with username:", username)

    const adminData = await db.collection("admins").findOne(
      { username }, // Query by username
      { projection: { password: 0 } },
    )

    if (!adminData) {
      console.log("API /api/admin/me: Admin not found in DB for username:", username)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    console.log("API /api/admin/me: Admin data fetched successfully for:", adminData.email)
    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Admin Me API Error:", error)
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
