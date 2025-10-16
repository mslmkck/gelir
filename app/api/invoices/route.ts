import { NextResponse } from "next/server";

import { parseJsonBody } from "@/lib/http/body";
import { handleRouteError } from "@/lib/http/error-response";
import { invoicesService } from "@/lib/services/invoices";

export async function GET() {
  try {
    const data = await invoicesService.list();

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await parseJsonBody(request);
    const data = await invoicesService.create(payload);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
