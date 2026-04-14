import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This handles LOGIN
export async function POST(req: Request) {
  const { token } = await req.json();
  const cookieStore = await cookies();

  cookieStore.set('algrace_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return NextResponse.json({ message: 'Session Set' });
}

// This handles LOGOUT
export async function DELETE() {
  const cookieStore = await cookies();
  
  // Kill the cookie
  cookieStore.delete('algrace_session');
  
  return NextResponse.json({ message: 'Session Cleared' });
}