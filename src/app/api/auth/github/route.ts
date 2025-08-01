import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const GITHUB_REDIRECT_URI = `${BASE_URL}/api/auth/github`;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FRONTEND_URL = BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // If no code, redirect to GitHub OAuth
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID!);
    githubAuthUrl.searchParams.set('redirect_uri', GITHUB_REDIRECT_URI);
    githubAuthUrl.searchParams.set('scope', 'user:email');
    githubAuthUrl.searchParams.set('state', 'github-oauth');

    return NextResponse.redirect(githubAuthUrl.toString());
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID!,
        client_secret: GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token:', await tokenResponse.text());
      return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    if (!access_token) {
      console.error('No access token received from GitHub');
      return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info:', await userResponse.text());
      return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
    }

    const githubUser = await userResponse.json();

    // Get user email (GitHub might not return email in the user object)

    let email = githubUser.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: { primary: boolean; verified: boolean; email: string }) => e.primary && e.verified);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    if (!email) {
      console.error('No email found for GitHub user');
      return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=no_email`);
    }

    // Connect to MongoDB
    await connectDB();

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({
        name: githubUser.name || githubUser.login,
        email,
        avatar: githubUser.avatar_url,
        provider: 'github',
        providerId: githubUser.id.toString(),
      });
      await user.save();
    } else {

      // Update existing user with GitHub info if needed

      if (!user.provider) {
        user.provider = 'github';
        user.providerId = githubUser.id.toString();
        if (githubUser.avatar_url && !user.avatar) {
          user.avatar = githubUser.avatar_url;
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
    redirectUrl.searchParams.set('provider', 'github');

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
  }
}
