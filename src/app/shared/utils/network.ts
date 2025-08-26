export function isOfflineError(err: any): boolean {
  try {
    // Angular HttpErrorResponse has status === 0 for network errors
    if (err && typeof err === 'object' && 'status' in err && (err as any).status === 0) {
      return true;
    }
  } catch {}
  // Fallback using navigator if available in the browser
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine === false;
  }
  return false;
}
