import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { requireAdmin } from "@/lib/auth"

// GET - Fetch single service
export const GET = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const service = await db.collection("services").findOne({ _id: new ObjectId(params.id) })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Get Service API Error:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
})

// PUT - Update service
export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const { name, description, benefits, duration, prices, image, available, models } = body

    if (!name || !description || !duration || !prices) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updateData = {
      name,
      description,
      benefits: benefits || [],
      duration: duration || [],
      prices: prices || {},
      image: image || "",
      models: models || [],
      available: available !== undefined ? available : true,
      updatedAt: new Date(),
    }

    const result = await db.collection("services").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Service updated successfully" })
  } catch (error) {
    console.error("Update Service API Error:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
})

// DELETE - Delete service
export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    // Check if service is being used in any bookings
    const bookingsCount = await db.collection("bookings").countDocuments({ serviceId: params.id })

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete service that has existing bookings. Consider disabling it instead." },
        { status: 400 },
      )
    }

    const result = await db.collection("services").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("Delete Service API Error:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
})
