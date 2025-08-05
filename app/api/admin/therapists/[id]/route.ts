import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const updatedTherapist = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialties: body.specialties || [],
      bio: body.bio || "",
      experience: body.experience || 0,
      status: body.status || "active",
      imageUrl: body.imageUrl || "",
      gender: body.gender || "male",
      updatedAt: new Date(),
    }
    
    const result = await db.collection("therapists").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updatedTherapist }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      therapist: { ...updatedTherapist, _id: params.id }
    })
  } catch (error) {
    console.error("Update Therapist Error:", error)
    return NextResponse.json({ error: "Failed to update therapist" }, { status: 500 })
  }
})

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const client = await clientPromise
    const db = client.db("massage_therapy")
    
    const result = await db.collection("therapists").deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: "Therapist deleted successfully" })
  } catch (error) {
    console.error("Delete Therapist Error:", error)
    return NextResponse.json({ error: "Failed to delete therapist" }, { status: 500 })
  }
})
