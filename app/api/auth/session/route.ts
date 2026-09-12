import { NextResponse } from "next/server";
import { sessionProbeBody } from "@/lib/auth/probe";
import { isSessionAuthenticated } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isSessionAuthenticated();

  return NextResponse.json(
    sessionProbeBody(authenticated),
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
