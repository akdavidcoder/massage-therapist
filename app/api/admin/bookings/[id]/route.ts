// app/api/admin/bookings/[id]/route.ts

import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// This is the PUT handler that updates a booking's status or payment status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Log the request
  console.log(`--- ADMIN BOOKING UPDATE [PUT] HIT for ID: ${id} ---`);
  
  try {
    // Check for a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    // Prepare update object
    const updateObj: any = {
      updatedAt: new Date()
    };

    // If updating booking status
    if (status) {
      const validStatuses = ["confirmed", "pending", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
      }
      updateObj.status = status;
    }

    // If updating payment status
    if (paymentStatus) {
      const validPaymentStatuses = ["pending", "paid", "failed"];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status provided" }, { status: 400 });
      }
      updateObj.paymentStatus = paymentStatus;
    }
    
    console.log(`Attempting to update booking ${id} with:`, updateObj);

    const client = await clientPromise;
    const db = client.db("massage_therapy");

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObj }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log(`Successfully updated booking ${id}`);
    return NextResponse.json({ success: true, message: "Booking updated successfully" });

  } catch (error) {
    console.error(`!!! ADMIN BOOKING UPDATE [PUT] ERROR for ID: ${id}:`, error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log(`--- ADMIN BOOKING DELETE [DELETE] HIT for ID: ${id} ---`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("massage_therapy");

    const result = await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log(`Successfully deleted booking ${id}`);
    return NextResponse.json({ success: true, message: "Booking deleted successfully" });

  } catch (error) {
    console.error(`!!! ADMIN BOOKING DELETE [DELETE] ERROR for ID: ${id}:`, error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
