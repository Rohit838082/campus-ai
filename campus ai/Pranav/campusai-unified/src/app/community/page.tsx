import { db } from "@/db";
import { forumPosts, leaderboard } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CommunityClient } from "./CommunityClient";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await db.select().from(forumPosts).orderBy(desc(forumPosts.upvotes));
  const board = await db.select().from(leaderboard);
  return <CommunityClient posts={posts} board={board} />;
}
