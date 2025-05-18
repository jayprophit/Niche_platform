import { NextRequest, NextResponse } from 'next/server';
import { SocialModule } from '../../../../components/social/socialModule';

// POST /api/social/reaction
export async function POST(req: NextRequest) {
  const { postId, userId, reactionType } = await req.json();
  if (!postId || !userId || !reactionType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const socialModule = new SocialModule();
  // You may need to inject services here
  await socialModule.addReaction(postId, userId, reactionType);
  return NextResponse.json({ success: true });
}
await fetch('/api/social/reaction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ postId, userId, reactionType })
});