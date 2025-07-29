import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blocked date ID" }, { status: 400 })
    }

    const result = await db.collection("blocked_dates").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blocked date not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Date unblocked successfully" })
  } catch (error) {
    console.error("Unblock Date API Error:", error)
    return NextResponse.json({ error: "Failed to unblock date" }, { status: 500 })
  }
})
