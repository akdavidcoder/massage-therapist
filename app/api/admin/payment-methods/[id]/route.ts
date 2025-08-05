// app/api/admin/payment-methods/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PUT update individual payment method
export const PUT = requireAdmin(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid payment method ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("massage_therapy")

    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    // Remove _id from update data if present
    delete updateData._id

    const result = await db.collection("payment_methods").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Payment method not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update Payment Method Error:", error)
    return NextResponse.json({ error: "Failed to update payment method" }, { status: 500 })
  }
})

// DELETE payment method
export const DELETE = requireAdmin(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid payment method ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("massage_therapy")

    const result = await db.collection("payment_methods").deleteOne(
      { _id: new ObjectId(id) }
    )

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Payment method not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete Payment Method Error:", error)
    return NextResponse.json({ error: "Failed to delete payment method" }, { status: 500 })
  }
})
