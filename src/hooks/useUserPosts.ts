import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import type { Post } from "@/hooks/useCommunity";

type CommunityRawPost = Omit<Post, "likes_count" | "is_liked"> & {
  likes?: Array<{ user_id: string }>;
};

export function useUserPosts(userId?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error: postsError } = await supabase
        .from("community_posts")
        .select(
          `
            *,
            author:user_id (
              full_name,
              username,
              avatar_url,
              occupation
            ),
            likes:community_post_likes(user_id)
          `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (postsError) {
        throw postsError;
      }

      const nextPosts = ((data || []) as CommunityRawPost[]).map((post) => ({
        ...post,
        likes_count: post.likes?.length || 0,
        is_liked: user ? post.likes?.some((like) => like.user_id === user.id) || false : false,
      }));

      setPosts(nextPosts);
    } catch (nextError) {
      setPosts([]);
      setError(nextError instanceof Error ? nextError.message : "No pudimos cargar la actividad.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    refreshPosts: loadPosts,
  };
}
