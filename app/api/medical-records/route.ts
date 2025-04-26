import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { medicalRecordsService } from '@/lib/firebase-services';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user token
    const decodedToken = await auth.verifyIdToken(authToken);
    const userId = decodedToken.uid;
    
    // Get records
    const records = await medicalRecordsService.getUserRecords(userId);
    
    return NextResponse.json({ records });
  } catch (error: any) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

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
    
    // Get record data from request
    const data = await req.json();
    
    // Add record
    const record = await medicalRecordsService.addRecord(userId, data);
    
    return NextResponse.json({ record });
  } catch (error: any) {
    console.error('Error adding record:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add record' },
      { status: 500 }
    );
  }
}