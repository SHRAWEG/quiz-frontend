/**
 * OAuth Configuration Constants
 * These values are used as fallbacks if the API doesn't return them
 */

export const OAUTH_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || "faf8645eabdd2f587997f8e4ab7cf21c",
  DEFAULT_REDIRECT_URI: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || "https://forum.sadhanaprep.com/oauth2/complete/",
  DEFAULT_RESPONSE_TYPE: "code",
  DEFAULT_SCOPE: "openid profile email",
} as const;

