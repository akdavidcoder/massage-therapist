import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return null;
  } catch (e) {
    console.error('API Auth Error:', e);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid therapist ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = {
      name: String(body.name || ''),
      email: String(body.email || ''),
      phone: String(body.phone || ''),
      specialties: Array.isArray(body.specialties) ? body.specialties : String(body.specialties || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      bio: String(body.bio || ''),
      experience: Number(body.experience) || 0,
      status: body.status === 'inactive' ? 'inactive' : 'active',
      imageUrl: String(body.imageUrl || ''),
      gender: body.gender === 'female' ? 'female' : 'male',
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db('massage_therapy');
    const result = await db.collection('therapists').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Update Therapist Error:', e);
    return NextResponse.json({ error: 'Failed to update therapist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid therapist ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('massage_therapy');
    const result = await db.collection('therapists').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete Therapist Error:', e);
    return NextResponse.json({ error: 'Failed to delete therapist' }, { status: 500 });
  }
}
