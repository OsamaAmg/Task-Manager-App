# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for your Task Manager app.

## Prerequisites

1. Google Cloud Console account
2. GitHub account
3. MongoDB database (local or Atlas)

## Setup Steps

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the required values:

```bash
cp .env.local.example .env.local
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google` (for development)
   - `https://yourdomain.com/api/auth/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local` file

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (for development)
   - Authorization callback URL: `http://localhost:3000/api/auth/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret
6. Add these to your `.env.local` file

### 4. MongoDB Setup

Ensure your MongoDB connection string is properly configured in `.env.local`:

```
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

Or for MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
```

### 5. JWT Secret

Set a strong JWT secret:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Testing OAuth

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/auth/login`
3. Click on "Google" or "GitHub" buttons
4. You should be redirected to the provider's OAuth page
5. After authorization, you'll be redirected back to your app with a token

## Troubleshooting

### Common Issues

1. **"OAuth authentication failed"**
   - Check your client ID and secret
   - Verify redirect URIs match exactly
   - Ensure APIs are enabled in Google Cloud Console

2. **"No email found"** (GitHub)
   - Make sure your GitHub email is public or verified
   - Check email permissions in GitHub settings

3. **"Invalid redirect URI"**
   - Verify the redirect URI in your OAuth app settings matches exactly
   - Check for trailing slashes or protocol mismatches

### Debug Mode

The auth utilities include detailed console logging. Check the browser console for detailed error messages.

## Production Deployment

1. Update all URLs in your OAuth app settings to use your production domain
2. Update `NEXTAUTH_URL` in your environment variables
3. Use a strong, unique JWT secret
4. Enable HTTPS for all OAuth redirects
