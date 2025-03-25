import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const protectedRoutes = [
      /^\/dashboard(\/.*)?$/,
      "/profile",
      /^\/proker(\/.*)?$/,
    ];

    const isProtectedRoute = protectedRoutes.some((route) => {
      if (typeof route === "string") {
        return request.nextUrl.pathname.startsWith(route);
      } else if (route instanceof RegExp) {
        return route.test(request.nextUrl.pathname);
      }
      return false;
    });
    // If no session and trying to access a protected route, redirect to login
    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If session exists and trying to access login/register, redirect to dashboard
    if (session && ["/login", "/register"].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
    // Define protected routes
  } catch (error) {
    console.error("Error in updateSession:", error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
