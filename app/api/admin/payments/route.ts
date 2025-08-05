// api/admin/payments/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Get all bookings with payment information
    const payments = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            paymentMethod: "crypto",
          },
        },
        {
          $project: {
            _id: 1,
            clientName: 1,
            clientEmail: 1,
            serviceName: 1,
            amount: "$price",
            cryptoAmount: "$cryptoAmount",
            walletAddress: 1,
            status: "$paymentStatus",
            date: 1,
            bookingId: "$_id",
          },
        },
        {
          $sort: { date: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Get Payments API Error:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
})
