function getCookie(request, name) {
  const header = request.headers.get("cookie");
  if (!header) return null;

  for (const part of header.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  if (
    pathname === "/login.html" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/css/") ||
    pathname.startsWith("/js/")
  ) {
    return fetch(request);
  }

  const authToken = process.env.AUTH_TOKEN;
  const cookieValue = getCookie(request, "auth");

  if (authToken && cookieValue === authToken) {
    return fetch(request);
  }

  return Response.redirect(new URL("/login.html", request.url));
}

export const config = {
  matcher: ["/((?!login\\.html|api/|css/|js/).*)"]
};
