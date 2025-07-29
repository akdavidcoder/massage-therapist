import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const schedule = await db.collection("schedule").findOne({ type: "working_hours" })

    return NextResponse.json(schedule || { workingHours: {} })
  } catch (error) {
    console.error("Get Working Hours API Error:", error)
    return NextResponse.json({ error: "Failed to fetch working hours" }, { status: 500 })
  }
})

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const { workingHours } = body

    await db.collection("schedule").updateOne(
      { type: "working_hours" },
      {
        $set: {
          workingHours,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          type: "working_hours",
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true, message: "Working hours updated successfully" })
  } catch (error) {
    console.error("Update Working Hours API Error:", error)
    return NextResponse.json({ error: "Failed to update working hours" }, { status: 500 })
  }
})
