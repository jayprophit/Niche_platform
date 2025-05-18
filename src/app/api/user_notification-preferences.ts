import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../lib/mongoClient';

// GET /api/user_notification-preferences?userId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const db = await getDb();
  const doc = await db.collection('userPreferences').findOne({ userId });
  const preferences = doc?.preferences || {
    // Social Interactions
    reactions: true,
    shares: true,
    comments: true,
    mentions: true,
    follows: true,
    
    // Content Management
    reports: true,
    contentApproved: true,
    contentRejected: true,
    
    // Messages
    messages: true,
    groupMessages: true,
    
    // Groups & Events
    groupInvites: true,
    groupUpdates: true,
    eventReminders: true,
    eventRSVP: true,
    
    // System & Security
    accountSecurity: true,
    platformUpdates: true
  };
  return NextResponse.json(preferences);
}

// PUT /api/user_notification-preferences?userId=...
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  const preferences = await req.json();
  // Validate preferences (all must be boolean)
  for (const [key, value] of Object.entries(preferences)) {
    if (typeof value !== 'boolean') {
      return NextResponse.json(
        { error: `Invalid value for ${key}: must be boolean` },
        { status: 400 }
      );
    }
  }
  const db = await getDb();
  await db.collection('userPreferences').updateOne(
    { userId },
    { $set: { preferences } },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}
