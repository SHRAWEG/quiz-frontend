"use client";

/**
 * Opens the forum login page in a new tab
 * This function should only be called on the client side
 */
export function redirectToForum() {
  // Ensure we're on the client side
  if (typeof window === "undefined") {
    return;
  }

  // Open forum login page in a new tab
  window.open("https://forum.sadhanaprep.com/oauth2/login/", "_blank");
}

