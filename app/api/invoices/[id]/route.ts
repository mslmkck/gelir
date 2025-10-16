import { NextResponse } from "next/server";

import { parseJsonBody } from "@/lib/http/body";
import { handleRouteError } from "@/lib/http/error-response";
import { parseId } from "@/lib/http/params";
import { invoicesService } from "@/lib/services/invoices";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const id = parseId(context.params.id);
    const data = await invoicesService.getById(id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const id = parseId(context.params.id);
    const payload = await parseJsonBody(request);
    const data = await invoicesService.update(id, payload);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const id = parseId(context.params.id);
    await invoicesService.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
