import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import fetch for server-side API calls

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Basic email format validation
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate email using Abstract API
export async function isValidEmailAbstract(email: string): Promise<{ isValid: boolean; error?: string }> {
  if (!isValidEmailFormat(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  const apiKey = process.env.ABSTRACT_API_KEY
  if (!apiKey) {
    return { isValid: false, error: 'Email validation API key not configured' }
  }

  try {
    const res = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`)
    if (!res.ok) {
      return { isValid: false, error: 'Email validation service error' }
    }
    const data = await res.json()
    // Check deliverability and format
    if (data.is_valid_format?.value !== true) {
      return { isValid: false, error: 'Please enter a valid email address' }
    }
    if (data.is_smtp_valid?.value !== true) {
      return { isValid: false, error: 'Email address does not exist or cannot receive emails' }
    }
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Email validation failed' }
  }
}

// Comprehensive email validation
export async function validateEmail(email: string): Promise<{ isValid: boolean; error?: string }> {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }
  return await isValidEmailAbstract(email)
}
