export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

export function isTokenExpired(token) {
  const t = parseJwt(token);
  if (t.exp && Date.now() < t.exp * 1000) {
    return false;
  }
  return true;
}
