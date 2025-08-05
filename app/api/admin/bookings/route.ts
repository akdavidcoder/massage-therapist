import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Booking } from "@/lib/types"

// Adjusted type for booking creation
type BookingCreateData = Omit<Booking, '_id' | 'clientId'> & {
  model?: string;
};

export async function POST(request: NextRequest) {
  console.log("--- CREATE BOOKING API [POST] HIT ---");

  try {
    const body = await request.json()
    console.log("Received booking data from form:", body);

    const client = await clientPromise
    const db = client.db("massage_therapy")

    const booking: BookingCreateData = {
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
      cryptoAmount: body.price,
      model: body.model,
      notes: body.notes,
      createdAt: new Date(),
    }

    if (body.walletAddress && typeof body.walletAddress === 'string' && body.walletAddress.trim() !== '') {
      booking.walletAddress = body.walletAddress.trim();
    }

    console.log("Attempting to insert this object into DB:", booking);

    const result = await db.collection("bookings").insertOne(booking)
    console.log("Database insertion result:", result);

    if (!result.insertedId) {
      throw new Error("Database insertion failed, no insertedId returned.");
    }

    const clientDataForSet = {
      name: body.clientName,
      email: body.clientEmail,
      phone: body.clientPhone,
      gender: body.clientGender,
      lastVisit: new Date(),
    }

    await db.collection("clients").updateOne(
      { email: body.clientEmail },
      { $set: clientDataForSet, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    )
    
    console.log("Client data upserted successfully for:", body.clientEmail);

    return NextResponse.json({
      success: true,
      bookingId: result.insertedId,
    })
  } catch (error) {
    console.error("!!! BOOKING API [POST] ERROR:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  console.log("--- GET ALL BOOKINGS API [GET] HIT ---");
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
    
    console.log("Fetching bookings with query:", query);

    const bookings = await db.collection("bookings").find(query).sort({ date: 1, time: 1 }).toArray()
    
    console.log(`Found ${bookings.length} bookings.`);

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("!!! GET BOOKINGS API [GET] ERROR:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}