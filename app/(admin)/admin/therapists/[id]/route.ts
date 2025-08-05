// app/(admin)/admin/therapists/[id]/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Use the new library for token verification
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// This is our new reusable function to protect API routes
async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    // If no token is found, unauthorized
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    
    // If verification succeeds, return null to allow the main function to proceed
    return null;
  } catch (error) {
    // If verification fails, unauthorized
    console.error("API Auth Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Your PUT handler, now using the new `requireAdmin`
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("massage_therapy");
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid therapist ID" }, { status: 400 });
    }
    
    const updateData = {
      name: body.name, gender: body.gender, imageUrl: body.imageUrl,
      bio: body.bio, services: body.services, available: body.available,
      updatedAt: new Date(),
    };
    
    const result = await db.collection("therapists").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData });
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Therapist Error:", error);
    return NextResponse.json({ error: "Failed to update therapist" }, { status: 500 });
  }
}

// Your DELETE handler, now using the new `requireAdmin`
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    // ... your delete logic remains the same ...
  } catch (error) {
    // ...
  }
}

// Your PATCH handler, now using the new `requireAdmin`
export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;
  
  try {
    // ... your patch logic remains the same ...
  } catch (error) {
    // ...
  }
}