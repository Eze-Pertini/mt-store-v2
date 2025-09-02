import { NextRequest, NextResponse } from 'next/server';

export function requireAdmin(req: NextRequest) {
  const cookie = req.cookies.get('admin_auth')?.value;
  if (cookie !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null; // OK
}
