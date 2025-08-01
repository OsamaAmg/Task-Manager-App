import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const GOOGLE_REDIRECT_URI = `${BASE_URL}/api/auth/google`;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FRONTEND_URL = BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // If no code, redirect to Google OAuth

  if (!code) {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', 'google-oauth');

    return NextResponse.redirect(googleAuthUrl.toString());
  }

  try {
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token:', await tokenResponse.text());
      return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info:', await userResponse.text());
      return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
    }

    const googleUser = await userResponse.json();

    // Connect to MongoDB
    await connectDB();

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        provider: 'google',
        providerId: googleUser.id,
      });
      await user.save();
    } else {
      // Update existing user with Google info if needed
      if (!user.provider) {
        user.provider = 'google';
        user.providerId = googleUser.id;
        if (googleUser.picture && !user.avatar) {
          user.avatar = googleUser.picture;
        }
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const redirectUrl = new URL(`${FRONTEND_URL}/auth/callback`);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('provider', 'google');

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
  }
}
