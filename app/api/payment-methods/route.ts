// app/api/payment-methods/route.ts
import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET enabled payment methods for public booking page
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const paymentMethods = await db
      .collection("payment_methods")
      .find({ enabled: true })
      .sort({ displayOrder: 1 })
      .toArray()

    // Only return necessary fields for security
    const publicPaymentMethods = paymentMethods.map(method => ({
      _id: method._id,
      name: method.name,
      type: method.type,
      details: method.details,
      instructions: method.instructions
    }))

    return NextResponse.json({ success: true, paymentMethods: publicPaymentMethods })
  } catch (error) {
    console.error("Get Payment Methods Error:", error)
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
  }
}
