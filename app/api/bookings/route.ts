import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Booking } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Create booking object
     const booking: Partial<Booking> = {
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      clientGender: body.clientGender,
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      duration: body.duration,
      price: body.price,
      date: new Date(body.date),
      time: body.time,
      location: body.location,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "crypto",
      walletAddress: body.walletAddress,
      cryptoAmount: body.price,
      notes: body.notes,
      createdAt: new Date(),
    }

    // Insert booking
    const result = await db.collection("bookings").insertOne(booking)

    // Also create/update client in clients collection
    const clientDataForSet = { // Data to always set/update
      name: body.clientName,
      email: body.clientEmail,
      phone: body.clientPhone,
      gender: body.clientGender,
      lastVisit: new Date(),
    }

    await db.collection("clients").updateOne(
      { email: body.clientEmail },
      {
        $set: clientDataForSet, // Fields that are always updated
        $setOnInsert: { createdAt: new Date() }, // Field only set on insert
      },
      { upsert: true },
    )


    return NextResponse.json({
      success: true,
      bookingId: result.insertedId,
    })
  } catch (error) {
    console.error("Booking API Error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")

    const query: any = {}
    if (status) query.status = status
    if (date) {
      const selectedDate = new Date(date)
      const nextDay = new Date(selectedDate)
      nextDay.setDate(nextDay.getDate() + 1)
      query.date = { $gte: selectedDate, $lt: nextDay }
    }

    const bookings = await db.collection("bookings").find(query).sort({ date: 1, time: 1 }).toArray()

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Get Bookings API Error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
