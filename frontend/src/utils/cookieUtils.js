// Set a cookie with optional expiration and path
export const setCookie = (name, value, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      typeof value === 'object' ? JSON.stringify(value) : value
    )}; expires=${expires}; path=${path}; SameSite=Strict`;
  };
  
  // Get a cookie by name
  export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(';').shift();
      try {
        // Try to parse as JSON if possible
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (e) {
        // If not JSON, return as is
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };
  
  // Remove a cookie
  export const removeCookie = (name, path = '/') => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict`;
  };
  