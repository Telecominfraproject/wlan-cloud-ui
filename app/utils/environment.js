/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

export function isLocalhost() {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return true;
  }
  return false;
}
