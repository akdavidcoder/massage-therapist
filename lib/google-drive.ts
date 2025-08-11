import { google } from 'googleapis';
import { Readable } from 'stream';

// Google Drive configuration
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
const GOOGLE_USER_EMAIL = process.env.GOOGLE_USER_EMAIL || '';

export async function uploadToGoogleDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  try {
    // Debug environment variables
    console.log('Service Account Email:', GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Not set');
    console.log('Private Key:', GOOGLE_PRIVATE_KEY ? 'Set' : 'Not set');
    console.log('Folder ID:', GOOGLE_DRIVE_FOLDER_ID ? 'Set' : 'Not set');

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error('Google Drive credentials not configured');
    }

    // Initialize auth for service account
    const auth = new google.auth.JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: fileName,
    };

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    const media = {
      mimeType,
      body: stream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
    });

    const fileId = response.data.id;
    if (!fileId) {
      throw new Error('Failed to get file ID from Google Drive');
    }

    // Make the file publicly viewable
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Return the direct access URL
    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}