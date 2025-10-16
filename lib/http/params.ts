import { BadRequestError } from "@/lib/errors";

export function parseId(raw: string): number {
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid identifier provided");
  }

  return id;
}
