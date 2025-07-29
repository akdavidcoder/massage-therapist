import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Find admin user
    const admin = await db.collection("admins").findOne({ email })

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "24h" })

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Auth API Error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
