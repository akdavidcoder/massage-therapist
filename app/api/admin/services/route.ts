import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import type { Service } from "@/lib/types"

// GET - Fetch all services
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const services = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(services)
  } catch (error) {
    console.error("Get Services API Error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
})

// POST - Create new service
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    // Validate required fields
    const { name, description, benefits, duration, prices, image, available } = body

    if (!name || !description || !duration || !prices) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create service object
    const service: Partial<Service> = {
      name,
      description,
      benefits: benefits || [],
      duration: duration || [],
      prices: prices || {},
      image: image || "",
      available: available !== undefined ? available : true,
      createdAt: new Date(),
    }

    const result = await db.collection("services").insertOne(service)

    return NextResponse.json({
      success: true,
      serviceId: result.insertedId,
      service: { ...service, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Create Service API Error:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
})
