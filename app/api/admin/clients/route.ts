import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }
    }

    const clients = await db.collection("clients").find(query).sort({ lastVisit: -1 }).skip(skip).limit(limit).toArray()

    const total = await db.collection("clients").countDocuments(query)

    // Get booking count for each client
    const clientsWithBookings = await Promise.all(
      clients.map(async (client) => {
        const bookingCount = await db.collection("bookings").countDocuments({
          clientEmail: client.email,
        })
        const totalSpent = await db
          .collection("bookings")
          .aggregate([
            {
              $match: {
                clientEmail: client.email,
                paymentStatus: "paid",
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$price" },
              },
            },
          ])
          .toArray()

        return {
          ...client,
          bookingCount,
          totalSpent: totalSpent[0]?.total || 0,
        }
      }),
    )

    return NextResponse.json({
      clients: clientsWithBookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get Clients API Error:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
})
