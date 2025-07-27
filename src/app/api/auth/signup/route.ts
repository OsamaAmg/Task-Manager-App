import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { validateEmail } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate email format and domain
    const emailValidation = await validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ token }, { status: 201 });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });

    return res;
  } catch (error: unknown) {
     console.error("Signup error:", error);
     const errorMessage = error instanceof Error ? error.message : "Signup failed";
     return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
