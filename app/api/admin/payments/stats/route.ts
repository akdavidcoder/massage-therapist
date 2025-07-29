import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total revenue (all paid bookings)
    const totalRevenueResult = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
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

    const totalRevenue = totalRevenueResult[0]?.total || 0

    // Monthly revenue
    const monthlyRevenueResult = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            date: { $gte: startOfMonth },
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

    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0

    // Pending payments count
    const pendingPayments = await db.collection("bookings").countDocuments({
      paymentStatus: "pending",
    })

    // Success rate
    const totalPayments = await db.collection("bookings").countDocuments({
      paymentMethod: "crypto",
    })
    const successfulPayments = await db.collection("bookings").countDocuments({
      paymentStatus: "paid",
    })
    const successRate = totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0

    // Revenue chart data (last 30 days)
    const revenueChart = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            date: { $gte: thirtyDaysAgo },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
            },
            revenue: { $sum: "$price" },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            date: "$_id",
            revenue: 1,
            _id: 0,
          },
        },
      ])
      .toArray()

    // Payment status distribution
    const paymentStatusDistribution = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            paymentMethod: "crypto",
          },
        },
        {
          $group: {
            _id: "$paymentStatus",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    const colors = { paid: "#22c55e", pending: "#f59e0b", failed: "#ef4444" }
    const paymentMethods = paymentStatusDistribution.map((status) => ({
      name: status._id.charAt(0).toUpperCase() + status._id.slice(1),
      value: status.count,
      color: colors[status._id] || "#6b7280",
    }))

    return NextResponse.json({
      stats: {
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        successRate,
      },
      revenueChart,
      paymentMethods,
    })
  } catch (error) {
    console.error("Payment Stats API Error:", error)
    return NextResponse.json({ error: "Failed to fetch payment stats" }, { status: 500 })
  }
})
