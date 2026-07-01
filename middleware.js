export default function middleware(request) {
  const { pathname } = new URL(request.url);

  if (
    pathname === "/login.html" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/css/") ||
    pathname.startsWith("/js/")
  ) {
    return;
  }

  const authCookie = request.cookies.get("auth");
  if (authCookie?.value === process.env.AUTH_TOKEN) {
    return;
  }

  return Response.redirect(new URL("/login.html", request.url));
}

export const config = {
  matcher: ["/((?!login\\.html|api/|css/|js/).*)"]
};
