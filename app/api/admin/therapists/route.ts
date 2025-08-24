import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import clientPromise from '@/lib/mongodb';

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) {
    console.error('Missing admin-token cookie');
    return NextResponse.json({ error: 'Unauthorized - Missing token' }, { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return null;
  } catch (e) {
    console.error('Invalid or expired token:', e);
    return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    const client = await clientPromise;
    const db = client.db('massage_therapy');
    const docs = await db.collection('therapists').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch (e) {
    console.error('GET therapists error:', e);
    return NextResponse.json({ error: 'Failed to fetch therapists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    const body = await request.json();

    const doc = {
      name: String(body.name || ''),
      email: String(body.email || ''),
      phone: String(body.phone || ''),
      specialties: Array.isArray(body.specialties) ? body.specialties : String(body.specialties || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      bio: String(body.bio || ''),
      experience: Number(body.experience) || 0,
      status: body.status === 'inactive' ? 'inactive' : 'active',
      imageUrl: String(body.imageUrl || ''), // comes from the upload API result
      gender: body.gender === 'female' ? 'female' : 'male',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!doc.name || !doc.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('massage_therapy');
    const result = await db.collection('therapists').insertOne(doc);

    return NextResponse.json({ ...doc, _id: result.insertedId });
  } catch (e) {
    console.error('POST therapist error:', e);
    return NextResponse.json({ error: 'Failed to create therapist' }, { status: 500 });
  }
}