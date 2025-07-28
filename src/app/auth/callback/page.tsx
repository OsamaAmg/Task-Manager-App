'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthToken } from '@/lib/auth';
import { toast } from 'sonner';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      let errorMessage = 'Authentication failed';
      switch (error) {
        case 'oauth_failed':
          errorMessage = 'OAuth authentication failed. Please try again.';
          break;
        case 'no_email':
          errorMessage = 'No email found in your account. Please ensure your email is public or verified.';
          break;
        default:
          errorMessage = 'Authentication failed. Please try again.';
      }
      
      toast.error(errorMessage);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }

    if (token) {
      try {
        // Store the token
        setAuthToken(token);
        
        // Show success message
        const providerName = provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'OAuth';
        toast.success(`Successfully signed in with ${providerName}!`);
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/Dashboard');
        }, 1000);
      } catch (error) {
        console.error('Error storing token:', error);
        toast.error('Failed to complete authentication');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } else {
      toast.error('No authentication token received');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg font-medium">Completing authentication...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
