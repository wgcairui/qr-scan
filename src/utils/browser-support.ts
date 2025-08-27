// Browser support utilities for camera access
export interface BrowserSupportInfo {
  isSupported: boolean;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  errorMessage?: string;
  suggestions: string[];
}

export const checkBrowserSupport = (): BrowserSupportInfo => {
  const suggestions: string[] = [];
  let isSupported = true;
  let errorMessage: string | undefined;

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      isSupported: false,
      isSecureContext: false,
      hasMediaDevices: false,
      hasGetUserMedia: false,
      errorMessage: 'Not in browser environment',
      suggestions: ['This feature only works in browsers']
    };
  }

  // Check secure context (HTTPS or localhost)
  const isSecureContext = 
    location.protocol === 'https:' || 
    location.hostname === 'localhost' || 
    location.hostname === '127.0.0.1' ||
    location.hostname === '[::1]';

  if (!isSecureContext) {
    isSupported = false;
    errorMessage = 'Camera access requires HTTPS';
    suggestions.push('Use HTTPS or localhost for testing');
    suggestions.push('Deploy to a secure hosting service like Vercel or Netlify');
  }

  // Check if navigator.mediaDevices exists
  const hasMediaDevices = !!(navigator && navigator.mediaDevices);
  
  if (!hasMediaDevices) {
    isSupported = false;
    if (!errorMessage) errorMessage = 'MediaDevices API not supported';
    suggestions.push('Use a modern browser (Chrome 53+, Firefox 36+, Safari 11+, Edge 12+)');
    suggestions.push('Update your browser to the latest version');
  }

  // Check if getUserMedia exists
  const hasGetUserMedia = hasMediaDevices && !!navigator.mediaDevices.getUserMedia;
  
  if (!hasGetUserMedia) {
    isSupported = false;
    if (!errorMessage) errorMessage = 'getUserMedia not supported';
    suggestions.push('Use a browser that supports camera access');
    suggestions.push('Enable camera permissions in browser settings');
  }

  // Additional browser-specific checks
  if (hasMediaDevices && hasGetUserMedia) {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for known problematic browsers
    if (userAgent.includes('firefox') && userAgent.includes('mobile')) {
      suggestions.push('Firefox Mobile may have limited camera support');
    }
    
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      // Safari-specific checks
      const safariVersion = userAgent.match(/version\/(\d+)/);
      if (safariVersion && parseInt(safariVersion[1]) < 11) {
        isSupported = false;
        errorMessage = 'Safari version too old';
        suggestions.push('Update Safari to version 11 or later');
      }
    }
  }

  if (isSupported && suggestions.length === 0) {
    suggestions.push('Camera access should work in this browser');
  }

  return {
    isSupported,
    isSecureContext,
    hasMediaDevices,
    hasGetUserMedia,
    errorMessage,
    suggestions
  };
};

export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return 'Server';
  
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  } else if (userAgent.includes('Edg')) {
    return 'Edge';
  } else if (userAgent.includes('Opera')) {
    return 'Opera';
  }
  
  return 'Unknown';
};

export const getRecommendedBrowsers = (): string[] => {
  return [
    'Chrome (recommended)',
    'Firefox', 
    'Safari 11+',
    'Edge',
    'Opera'
  ];
};

export const getCameraPermissionInstructions = (browser: string): string[] => {
  switch (browser.toLowerCase()) {
    case 'chrome':
      return [
        '1. Click the camera icon in the address bar',
        '2. Select "Always allow" for this site',
        '3. Refresh the page'
      ];
    case 'firefox':
      return [
        '1. Click the shield icon in the address bar',
        '2. Click "Allow" when prompted for camera access',
        '3. Refresh if needed'
      ];
    case 'safari':
      return [
        '1. Go to Safari > Settings for This Website',
        '2. Set Camera to "Allow"',
        '3. Refresh the page'
      ];
    case 'edge':
      return [
        '1. Click the camera icon in the address bar',
        '2. Select "Allow" for camera access',
        '3. Refresh the page'
      ];
    default:
      return [
        '1. Look for camera/permission icons in the address bar',
        '2. Allow camera access when prompted',
        '3. Refresh the page if needed'
      ];
  }
};