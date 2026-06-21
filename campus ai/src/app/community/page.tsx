import { db } from "@/db";
import { forumPosts, leaderboard } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CommunityClient } from "./CommunityClient";
import { mockForumPosts, mockLeaderboard } from "@/lib/mockFallback";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  let posts = mockForumPosts as typeof mockForumPosts;
  let board = mockLeaderboard as typeof mockLeaderboard;
  try {
    if (db) {
      const dbPosts = await db.select().from(forumPosts).orderBy(desc(forumPosts.upvotes));
      const dbBoard = await db.select().from(leaderboard);
      if (dbPosts.length > 0) posts = dbPosts as typeof mockForumPosts;
      if (dbBoard.length > 0) board = dbBoard as typeof mockLeaderboard;
    }
  } catch { /* use mock fallback */ }
  return <CommunityClient posts={posts} board={board} />;
}
