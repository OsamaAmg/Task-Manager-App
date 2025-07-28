// Debug Auth utility functions
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Debug: Check all possible localStorage keys
  console.log('=== localStorage Debug ===');
  console.log('All localStorage keys:', Object.keys(localStorage));
  console.log('localStorage length:', localStorage.length);
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key || '');
    console.log(`${key}: ${value?.substring(0, 20)}...`);
  }
  
  // Check both possible token keys
  const token = localStorage.getItem('token');
  const authToken = localStorage.getItem('authToken');
  const accessToken = localStorage.getItem('accessToken');
  const jwt = localStorage.getItem('jwt');
  
  console.log('token:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('authToken:', authToken ? authToken.substring(0, 20) + '...' : 'null');
  console.log('accessToken:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
  console.log('jwt:', jwt ? jwt.substring(0, 20) + '...' : 'null');
  console.log('=== End localStorage Debug ===');
  
  return token || authToken || accessToken || jwt;
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  console.log('Setting auth token:', token.substring(0, 20) + '...');
  
  // Store in multiple locations for compatibility
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token);
  
  console.log('Token stored successfully');
  console.log('Verification - token:', localStorage.getItem('token') ? 'exists' : 'missing');
  console.log('Verification - authToken:', localStorage.getItem('authToken') ? 'exists' : 'missing');
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('authTokenSet', { detail: { token } }));
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  console.log('Removing auth tokens...');
  
  // Remove from all possible locations
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('jwt');
  
  console.log('All tokens removed');
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('authTokenRemoved'));
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.log('No token found for headers');
    return {};
  }
  
  console.log('Creating auth headers with token:', token.substring(0, 20) + '...');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  console.log('isAuthenticated check - token exists:', !!token);
  
  if (!token) return false;
  
  // Also check if token is expired
  const expired = isTokenExpired(token);
  console.log('Token expired:', expired);
  
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
  } catch (error) {
    console.error('Error parsing JWT payload:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseJWTPayload(token);
    if (!payload || !payload.exp) {
      console.log('Token has no expiration or invalid payload');
      return true;
    }
    
    const currentTime = Date.now() / 1000;
    const expired = payload.exp < currentTime;
    console.log('Token expiration check:', {
      exp: payload.exp,
      current: currentTime,
      expired
    });
    
    return expired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if we can't parse
  }
};