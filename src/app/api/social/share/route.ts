import { NextRequest, NextResponse } from 'next/server';
import { SocialModule } from '../../../../components/social/socialModule';

// POST /api/social/share
export async function POST(req: NextRequest) {
  const { postId, userId, target, groupId } = await req.json();
  if (!postId || !userId || !target) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const socialModule = new SocialModule();
  // You may need to inject services here
  await socialModule.sharePost(postId, userId, target, groupId);
  return NextResponse.json({ success: true });
}
