import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Only return available services for public API
    const services = await db.collection("services").find({ available: true }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(services)
  } catch (error) {
    console.error("Get Services API Error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
