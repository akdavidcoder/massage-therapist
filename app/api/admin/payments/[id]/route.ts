import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 })
    }

    const { status } = body

    if (!["paid", "pending", "failed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          paymentStatus: status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Payment status updated successfully" })
  } catch (error) {
    console.error("Update Payment API Error:", error)
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
  }
})
