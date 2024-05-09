import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/", "/forum(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Restrict admin route to users with specific role
  // if (isAdminRoute(req)) auth().protect({ role: 'org:admin' });

  // Restrict dashboard routes to logged in users
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
    "/", // Run middleware on index page
    "/(api|trpc)(.*)",
  ], // Run middleware on API routes
};
