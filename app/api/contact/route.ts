import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("massage_therapy")

    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const contactMessage = {
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
      status: "unread",
      createdAt: new Date(),
    }

    const result = await db.collection("contact_messages").insertOne(contactMessage)

    return NextResponse.json({
      success: true,
      messageId: result.insertedId,
    })
  } catch (error) {
    console.error("Contact API Error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
