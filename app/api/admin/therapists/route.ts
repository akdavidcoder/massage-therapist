import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")
    const therapists = await db.collection("therapists").find({}).toArray()
    return NextResponse.json(therapists)
  } catch (error) {
    console.error("Get Therapists Error:", error)
    return NextResponse.json({ error: "Failed to fetch therapists" }, { status: 500 })
  }
})

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const therapist = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialties: body.specialties || [],
      bio: body.bio || "",
      experience: body.experience || 0,
      status: body.status || "active",
      imageUrl: body.imageUrl || "",
      gender: body.gender || "male",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await db.collection("therapists").insertOne(therapist)
    
    return NextResponse.json({
      success: true,
      therapist: { ...therapist, _id: result.insertedId }
    })
  } catch (error) {
    console.error("Create Therapist Error:", error)
    return NextResponse.json({ error: "Failed to create therapist" }, { status: 500 })
  }
})

