/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/check-role/route.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                request.cookies.set(name, value);
              } catch {
                // Ignore errors if called from a Server Component
              }
            });
          },
        },
      }
    );

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // If no session, return unauthorized
    if (!session || sessionError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user data with jabatan information
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select(`
        *,
        jabatan:jabatan_id(
          *,
          parent:parent_id(*)
        )
      `)
      .eq("id", session.user.id)
      .single();

    // If error or no user data, return not found
    if (userError || !userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    // Log data for debugging
    console.log("userData", userData?.jabatan?.bidang_id);
    console.log("session.user.id", session.user.id);
    console.log("user data lengkap", userData);
    // Return the user's data
    return NextResponse.json(
      { user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in get User:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}