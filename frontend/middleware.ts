import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Default locale
const defaultLocale = 'en'

// Supported locales
const locales = ['en', 'ru', 'kk', 'es']

// Get locale from pathname
function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/')
  const locale = segments[1]
  
  if (locales.includes(locale)) {
    return locale
  }
  
  return null
}

// Check if the pathname has a locale
function hasLocale(pathname: string): boolean {
  return getLocaleFromPathname(pathname) !== null
}

// Add locale to pathname
function addLocaleToPathname(pathname: string, locale: string): string {
  return `/${locale}${pathname}`
}

// Remove locale from pathname
function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/')
  const locale = segments[1]
  
  if (locales.includes(locale)) {
    return '/' + segments.slice(2).join('/')
  }
  
  return pathname
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    return NextResponse.next()
  }

  // Check if the pathname already has a locale
  if (hasLocale(pathname)) {
    // Handle protected routes with locale
    const token = request.cookies.get("access_token")?.value;
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const protectedPaths = ["/profile"];
    
    const isProtected = protectedPaths.some((path) => pathWithoutLocale.startsWith(path));

    if (isProtected && !token) {
      const locale = getLocaleFromPathname(pathname) || defaultLocale;
      const signInUrl = new URL(`/${locale}/signin`, request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  // For now, always use English as default
  // Later we can add browser language detection here
  const locale = defaultLocale

  // Create new URL with locale
  const newUrl = new URL(addLocaleToPathname(pathname, locale), request.url)
  
  // Redirect to localized path
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - icons (static icons)
     * - fonts (static fonts)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};
