// Auth utility functions
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check for token in localStorage
  const token = localStorage.getItem('token');
  const authToken = localStorage.getItem('authToken');
  
  return token || authToken;
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  // Store in multiple locations for compatibility
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token);
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('authTokenSet', { detail: { token } }));
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  // Remove from all possible locations
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('jwt');
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('authTokenRemoved'));
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  
  if (!token) return false;
  
  // Also check if token is expired
  const expired = isTokenExpired(token);
  
  return !expired;
};

// Parse JWT token to get user info (without verification - client-side only)
export const parseJWTPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseJWTPayload(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    const currentTime = Date.now() / 1000;
    const expired = payload.exp < currentTime;
    
    return expired;
  } catch {
    return true; // Assume expired if we can't parse
  }
};