import { BadRequestError } from "@/lib/errors";

export async function parseJsonBody<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch (error) {
    throw new BadRequestError("Request body must be valid JSON");
  }
}
