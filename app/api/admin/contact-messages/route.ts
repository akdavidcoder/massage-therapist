import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const messages = await db.collection("contact_messages").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Get Contact Messages API Error:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
  }
})
