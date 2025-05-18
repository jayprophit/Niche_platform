import { NextRequest, NextResponse } from 'next/server';
import { SocialModule } from '../../../../components/social/socialModule';

// POST /api/social/report
export async function POST(req: NextRequest) {
  const { contentId, userId, reason } = await req.json();
  if (!contentId || !userId || !reason) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const socialModule = new SocialModule();
  // You may need to inject services here
  await socialModule.reportContent(contentId, userId, reason);
  return NextResponse.json({ success: true });
}
