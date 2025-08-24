import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// (Optional) If you want to protect uploads to admins only, import and reuse requireAdmin here.

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `therapist-${Date.now()}`;

    const url = await uploadToCloudinary(buffer, fileName, 'therapists');

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Therapist upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
