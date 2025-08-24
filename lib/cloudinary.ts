// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Warn early if env vars are missing (helps debugging)
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    'Cloudinary not fully configured. Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set.'
  );
}

function mask(value?: string) {
  if (!value) return null;
  if (value.length <= 6) return '******';
  return value.slice(0, 3) + '...' + value.slice(-3);
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "driver-licenses"
): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder,
          public_id: fileName,
        },
        (error, result) => {
          if (error) {
            // include Cloudinary error object in server logs for debugging
            console.error('Cloudinary upload error callback:', error);
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        }
      );

      // Protect against unexpected stream errors
      stream.on('error', (err) => {
        console.error('Cloudinary upload stream error:', err);
        reject(err);
      });

      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
}

// Export a small util for checking config (used by the one-off endpoint)
export function getCloudinaryConfigCheck() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? String(process.env.CLOUDINARY_CLOUD_NAME) : null,
    api_key_present: Boolean(process.env.CLOUDINARY_API_KEY),
    api_key_masked: mask(process.env.CLOUDINARY_API_KEY),
    api_secret_present: Boolean(process.env.CLOUDINARY_API_SECRET),
    api_secret_masked: mask(process.env.CLOUDINARY_API_SECRET),
  };
}