import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
 
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es', 'pt'],
 
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});
 
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const { pathname } = url
  if (pathname.startsWith(`/api/`) && !pathname.includes("webhooks")) {
    const referer = req.headers.get("referer");
    if ((!referer?.includes(process.env.NEXT_PUBLIC_SITE_URL as string) && !pathname.includes(`/auth`) ) || (!referer && !pathname.includes(`/auth`))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    return NextResponse.next()
  }else{
    return intlMiddleware(req)

  }
}

export const config = {
  matcher: ['/((?!_next|fonts|examples|svg|[\\w-]+\\.\\w+).*)'],
};