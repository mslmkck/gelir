import { NextResponse } from "next/server";

import { dictionaryEntries } from "@/lib/data/dictionary";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(
    {
      data: dictionaryEntries,
      count: dictionaryEntries.length,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=86400",
      },
    }
  );
}
