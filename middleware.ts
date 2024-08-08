import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/select-org',
  '/organization(.*)',
]);

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, req) => {
  const authData = auth();
  // user is redirecting to protected route without login then redirect them to sign in route and then their initial protected route
  if (!authData?.userId && isProtectedRoute(req)) {
    return authData.redirectToSignIn({
      returnBackUrl: req.url,
    });
  } else if (authData.userId && isPublicRoute(req)) {
    // if the route is public but user is logged in then redirect them to select-org page or organization page
    let path = '/select-org';
    if (authData.orgId) {
      path = `/organization/${authData.orgId}`;
    }

    return NextResponse.redirect(new URL(path, req.url));
  } else if (
    authData.userId &&
    !authData.orgId &&
    req.nextUrl.pathname !== '/select-org'
  ) {
    return NextResponse.redirect(new URL('/select-org', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
