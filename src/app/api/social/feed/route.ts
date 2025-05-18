import { NextRequest, NextResponse } from 'next/server';
import { SocialModule } from '../../../../components/social/socialModule';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const search = searchParams.get('search') || '';
  // Add more filters as needed
  const socialModule = new SocialModule();
  const result = await socialModule.getPosts({ page, pageSize, search });
  return NextResponse.json(result);
}
