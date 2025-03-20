import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create a Supabase client
    const supabase = createClient();

    // Sign in with Supabase
    const { data, error } = await (await supabase).auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Debug: Cetak email dari Supabase Auth
    console.log("Supabase Auth user email:", data.user.email);

    // Check if user is verified in your database
    const { data: userData, error: userError } = await (await supabase)
      .from("users")
      .select(`
        *,
        jabatan:jabatan_id (
          *,
          parent:parent_id (*),
          bidang:bidang_id (*)
        )
      `)
      .eq("email", data.user.email) // Cari berdasarkan email
      .single();

    // Debug: Cetak hasil query Supabase
    console.log("User data from Supabase:", userData);
    console.log("Supabase query error:", userError);

    if (userError) {
      console.error("Supabase query error:", userError);
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    if (!userData) {
      console.error("User data not found for email:", data.user.email);
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // Check if user is verified
    if (!userData.isVerified) {
      return NextResponse.json(
        { error: "Akunmu Belum Disetujui Oleh Admin" },
        { status: 403 }
      );
    }

    // Update last login time
    await (await supabase)
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", userData.id);

    console.log("User logged in:", data.session);
    return NextResponse.json({
      user: userData,
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
} 