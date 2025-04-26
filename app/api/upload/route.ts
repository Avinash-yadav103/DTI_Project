import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { medicalRecordsService } from '@/lib/firebase-services';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user token
    const decodedToken = await auth.verifyIdToken(authToken);
    const userId = decodedToken.uid;
    
    // Process the multipart form data
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
    
    // Upload files
    const uploadedFiles = await medicalRecordsService.uploadFiles(userId, files);
    
    return NextResponse.json({ files: uploadedFiles });
  } catch (error: any) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload files' },
      { status: 500 }
    );
  }
}