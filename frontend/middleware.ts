import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/api/admin') || req.nextUrl.pathname.startsWith('/dashboard/admin');

    if (isAdminRoute) {
      if (token?.role !== "ADMIN") {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If it's a protected route, require a token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/pay',
    '/api/admin/:path*'
  ],
};
