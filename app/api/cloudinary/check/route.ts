import { NextResponse } from 'next/server';
import { getCloudinaryConfigCheck } from '@/lib/cloudinary';

export async function GET() {
  try {
    // Returns a safe check (booleans and masked values). No secrets are returned in full.
    const check = getCloudinaryConfigCheck();

    // Add a simple connectivity probe? Note: we avoid making actual uploads here to keep endpoint safe.
    return NextResponse.json({ ok: true, check });
  } catch (error) {
    console.error('Cloudinary check error:', error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}