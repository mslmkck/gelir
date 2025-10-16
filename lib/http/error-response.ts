import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { HttpError } from "@/lib/errors";

export function handleRouteError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: error.issues,
      },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Resource conflict",
          details: error.meta,
        },
        { status: 409 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Invalid relation reference",
          details: error.meta,
        },
        { status: 400 }
      );
    }
  }

  console.error("Unexpected API error", error);

  return NextResponse.json(
    {
      error: "Internal server error",
    },
    { status: 500 }
  );
}
