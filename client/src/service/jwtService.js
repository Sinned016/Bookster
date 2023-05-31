/**
 * parseJWT is used to decode JWT-tokens. For example, name or role of who's logged in.
 */
// Get jwt user info
export default function parseJwt(token) {
    if (!token) {
        return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
}