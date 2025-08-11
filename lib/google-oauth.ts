import { google } from 'googleapis';
import { Readable } from 'stream';

// OAuth configuration - you'll need to get these from Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

export async function uploadToGoogleDriveOAuth(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  try {
    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'http://localhost:3000' // redirect URI
    );

    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: fileName,
      parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined,
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