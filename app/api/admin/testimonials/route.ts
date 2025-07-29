import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const testimonials = await db.collection("testimonials").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Get Testimonials API Error:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
})

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const { clientName, rating, review, serviceType, verified } = body

    const testimonial = {
      clientName,
      rating,
      review,
      serviceType,
      verified: verified || false,
      createdAt: new Date(),
    }

    const result = await db.collection("testimonials").insertOne(testimonial)

    return NextResponse.json({
      success: true,
      testimonialId: result.insertedId,
    })
  } catch (error) {
    console.error("Create Testimonial API Error:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
})
