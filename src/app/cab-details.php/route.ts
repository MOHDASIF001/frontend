import { NextResponse } from 'next/server';

// Old per-vehicle cab pages have no equivalent now; send them to the cabs section
// (as a route handler rather than a next.config redirect so ?id= isn't carried over).
export function GET() {
  return NextResponse.redirect(new URL('/cabs', process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com'), 301);
}
