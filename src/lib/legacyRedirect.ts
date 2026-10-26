import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '../config';

// The site used to be plain PHP (e.g. /hotels-details.php?id=17). Google still has
// those URLs indexed, so each one 301s to its page on the current site. The old
// pages identified records by numeric id; the new ones use slugs, so the id is
// looked up in the backend. Anything that can't be resolved goes to the section page.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export function legacyRedirect(
  apiFile: string,
  fallbackPath: string,
  toPath: (record: Record<string, unknown>) => string | null,
) {
  return async function GET(request: NextRequest) {
    let target = fallbackPath;
    const id = parseInt(request.nextUrl.searchParams.get('id') || '', 10);
    if (id > 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/${apiFile}?id=${id}`, { next: { revalidate: 3600 } });
        const data = await res.json();
        if (data.status === 'success' && data.data) target = toPath(data.data) || fallbackPath;
      } catch {
        // Backend unreachable - the section page is still a better landing than a 404.
      }
    }
    return NextResponse.redirect(new URL(target, siteUrl), 301);
  };
}
