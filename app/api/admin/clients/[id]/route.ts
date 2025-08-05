import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    const clientData = await db.collection("clients").findOne({ _id: new ObjectId(params.id) })

    if (!clientData) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Get client's booking history
    const bookings = await db
      .collection("bookings")
      .find({ clientEmail: clientData.email })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      ...clientData,
      bookings,
    })
  } catch (error) {
    console.error("Get Client API Error:", error)
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    const { name, email, phone, gender, notes } = body

    const updateData = {
      name,
      email,
      phone,
      gender,
      notes: notes || "",
      updatedAt: new Date(),
    }

    const result = await db.collection("clients").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Client updated successfully" })
  } catch (error) {
    console.error("Update Client API Error:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    // Check if client has any bookings
    const bookingsCount = await db.collection("bookings").countDocuments({
      clientId: params.id,
    })

    if (bookingsCount > 0) {
      return NextResponse.json({ error: "Cannot delete client with existing bookings" }, { status: 400 })
    }

    const result = await db.collection("clients").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Client deleted successfully" })
  } catch (error) {
    console.error("Delete Client API Error:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
