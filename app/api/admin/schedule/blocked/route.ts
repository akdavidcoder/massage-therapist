import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const blockedDates = await db.collection("blocked_dates").find({}).sort({ date: 1 }).toArray()

    return NextResponse.json(blockedDates)
  } catch (error) {
    console.error("Get Blocked Dates API Error:", error)
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 })
  }
})

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const { date, reason, allDay, timeSlots } = body

    const blockedDate = {
      date: new Date(date),
      reason,
      allDay,
      timeSlots: timeSlots || [],
      createdAt: new Date(),
    }

    const result = await db.collection("blocked_dates").insertOne(blockedDate)

    return NextResponse.json({
      success: true,
      blockedDateId: result.insertedId,
    })
  } catch (error) {
    console.error("Block Date API Error:", error)
    return NextResponse.json({ error: "Failed to block date" }, { status: 500 })
  }
})
