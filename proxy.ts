import { NextResponse, type NextRequest } from "next/server";
import { isAdminPath } from "@/lib/auth/admin-gate";
import { isPublicSafeguardingPath } from "@/lib/public/safeguarding-gate";
import { refreshAuthSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname) || isPublicSafeguardingPath(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  return refreshAuthSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
