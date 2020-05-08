export function parseJwt(token) {
  const base64Url = token.split('.')[0];
  return JSON.parse(window.atob(base64Url));
}

export function isTokenExpired(token) {
  const t = parseJwt(token);
  if (t.exp && Date.now() < t.exp * 1000) {
    return false;
  }
  return true;
}
