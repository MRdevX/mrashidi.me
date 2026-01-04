import type { NextRequest } from "next/server";
import { extractPaginationParams } from "@/lib/utils/pagination";

export function getPaginationParams(request: NextRequest) {
  return extractPaginationParams(request);
}

export async function getJsonBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }
}
