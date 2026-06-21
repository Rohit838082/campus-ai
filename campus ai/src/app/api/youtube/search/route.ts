import { NextRequest, NextResponse } from "next/server";
import {
  type Filters,
  type Language,
  type Region,
  type ContentType,
  type Category,
  type SortOption,
} from "@/lib/videoMockData";

export const dynamic = "force-dynamic";

/**
 * Mock YouTube search API endpoint.
 * Returns an empty array immediately — the client's searchVideos() will
 * fall through to its local mock engine when it receives an empty array.
 * This stops the 404 console noise without adding a real YouTube API key.
 */
export async function GET(request: NextRequest) {
  // Parse filters from query params (for future real YouTube API integration)
  const { searchParams } = request.nextUrl;
  const _q = searchParams.get("q") ?? "";
  const _page = Number(searchParams.get("page") ?? 0);
  const _limit = Number(searchParams.get("limit") ?? 18);
  const _language = (searchParams.get("language") ?? "all") as Language | "all";
  const _region = (searchParams.get("region") ?? "all") as Region | "all";
  const _contentType = (searchParams.get("contentType") ?? "all") as ContentType | "all";
  const _category = (searchParams.get("category") ?? "all") as Category | "all";
  const _channel = searchParams.get("channel") ?? undefined;
  const _sort = (searchParams.get("sort") ?? "relevance") as SortOption;

  // Return empty → client falls back to local mock data (which is richer)
  return NextResponse.json({ videos: [], page: _page, hasMore: false, total: 0 });
}
