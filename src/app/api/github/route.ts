import { type NextRequest, NextResponse } from "next/server";
import { findLatestCommit } from "@/features/projects/server";
import { createMiddleware } from "@/lib/api/middleware";
import { APIError } from "@/lib/errors";

async function handleGitHubRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const githubUrl = searchParams.get("url");

  if (action !== "commit-info") {
    throw new APIError("Invalid action", 400);
  }

  if (!githubUrl) {
    throw new APIError("GitHub URL is required", 400);
  }

  return NextResponse.json(await findLatestCommit(githubUrl));
}

export const GET = createMiddleware("generalApi").build(handleGitHubRequest);
