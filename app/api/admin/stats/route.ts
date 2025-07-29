import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Today's bookings
    const todayBookings = await db.collection("bookings").countDocuments({
      date: { $gte: today, $lt: tomorrow },
    })

    // Monthly revenue (completed bookings only)
    const monthlyRevenueResult = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            date: { $gte: startOfMonth, $lte: endOfMonth },
            status: "completed",
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

    // Pending appointments
    const pendingAppointments = await db.collection("bookings").countDocuments({
      status: "pending",
    })

    // Returning clients percentage
    const totalClients = await db.collection("clients").countDocuments()
    const returningClientsResult = await db
      .collection("bookings")
      .aggregate([
        {
          $group: {
            _id: "$clientEmail",
            bookingCount: { $sum: 1 },
          },
        },
        {
          $match: {
            bookingCount: { $gt: 1 },
          },
        },
        {
          $count: "returningClients",
        },
      ])
      .toArray()

    const returningClients =
      totalClients > 0 ? Math.round(((returningClientsResult[0]?.returningClients || 0) / totalClients) * 100) : 0

    // Weekly booking trends
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyTrends = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            date: { $gte: weekAgo, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$date" },
            bookings: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray()

    // Convert day numbers to day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const formattedTrends = dayNames.map((name, index) => {
      const dayData = weeklyTrends.find((trend) => trend._id === index + 1)
      return {
        name,
        bookings: dayData?.bookings || 0,
      }
    })

    // Service distribution
    const serviceDistribution = await db
      .collection("bookings")
      .aggregate([
        {
          $match: {
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: "$serviceName",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .toArray()

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]
    const formattedServiceDistribution = serviceDistribution.map((service, index) => ({
      name: service._id,
      value: service.count,
      color: colors[index % colors.length],
    }))

    return NextResponse.json({
      todayBookings,
      monthlyRevenue,
      pendingAppointments,
      returningClients,
      weeklyTrends: formattedTrends,
      serviceDistribution: formattedServiceDistribution,
    })
  } catch (error) {
    console.error("Admin Stats API Error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
})
