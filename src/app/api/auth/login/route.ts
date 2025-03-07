import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LoginData } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body: LoginData = await req.json();
    const { email, password } = body;

    const supabase = createClient();

    // Authenticate user with Supabase Auth
    const { data: authData, error: authError } = await (await supabase).auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Login failed" }, { status: 400 });
    }

    // Fetch user data from Prisma database
    const user = await prisma.user.findUnique({
      where: { id: authData.user.id },
      include: { jabatan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json({ user, session: authData.session }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
