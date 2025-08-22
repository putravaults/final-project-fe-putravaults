import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const protectedRoutes = ['/admin', '/myreservation', '/checkout']

// Define admin-only routes that require admin role
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  const isLoggedIn = !!token?.user
  const userRole = token?.user?.role

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  )

  // Check if the current path is an admin-only route
  const isAdminRoute = adminRoutes.some((route) => 
    pathname.startsWith(route)
  )

  // If user is not logged in and trying to access a protected route
  if (!isLoggedIn && isProtectedRoute) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If user is logged in but trying to access admin route without admin role
  if (isLoggedIn && isAdminRoute && userRole !== 'ADMIN') {
    // Redirect to home page or access denied page
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  // If user is logged in and trying to access signin/signup pages, redirect to home
  if (isLoggedIn && (pathname.startsWith('/signin') || pathname.startsWith('/signup'))) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
