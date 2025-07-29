import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb" // Import ObjectId

export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)

    if (!admin) {
      console.log("API /api/admin/me: Unauthorized - No admin token or invalid token.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Convert admin.adminId string to MongoDB ObjectId
    const adminObjectId = new ObjectId(admin.adminId)
    console.log("API /api/admin/me: Querying for admin with ObjectId:", adminObjectId)

    const adminData = await db.collection("admins").findOne(
      { _id: adminObjectId }, // Use ObjectId for the query
      { projection: { password: 0 } },
    )

    if (!adminData) {
      console.log("API /api/admin/me: Admin not found in DB for ID:", admin.adminId)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    console.log("API /api/admin/me: Admin data fetched successfully for:", adminData.email)
    return NextResponse.json(adminData)
  } catch (error) {
    console.error("Admin Me API Error:", error)
    // Check if the error is due to invalid ObjectId format
    if (
      error instanceof Error &&
      error.message.includes(
        "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
      )
    ) {
      console.error("Admin Me API Error: Invalid adminId format in token.")
      return NextResponse.json({ error: "Invalid admin ID in token" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
