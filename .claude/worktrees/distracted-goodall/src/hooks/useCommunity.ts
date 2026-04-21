import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string | null;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  author?: {
    full_name: string;
    username: string;
    avatar_url: string;
    occupation: string;
  };
};

export type Reply = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
};

export type CommunityFeedMode = "for-you" | "recent";

type CommunityRawPost = Omit<Post, "likes_count" | "is_liked"> & {
  likes?: Array<{ user_id: string }>;
};

type UseCommunityOptions = {
  category?: string;
  mode?: CommunityFeedMode;
  pageSize?: number;
  enabled?: boolean;
};

const DEFAULT_PAGE_SIZE = 15;

const dedupePosts = (posts: Post[]) => Array.from(new Map(posts.map((post) => [post.id, post])).values());

const transformPosts = (posts: CommunityRawPost[], currentUserId?: string) =>
  posts.map((post) => ({
    ...post,
    likes_count: post.likes?.length || 0,
    is_liked: currentUserId ? post.likes?.some((like) => like.user_id === currentUserId) || false : false,
  }));

const getPostScore = (post: Post) => {
  const ageHours = Math.max(1, (Date.now() - new Date(post.created_at).getTime()) / 36e5);
  const likeBoost = post.likes_count * 3;
  const freshnessBoost = Math.max(0, 48 - ageHours) / 12;
  const recencyWeight = 1 / ageHours;

  return likeBoost + freshnessBoost + recencyWeight;
};

const sortPosts = (posts: Post[], mode: CommunityFeedMode) =>
  [...posts].sort((left, right) => {
    if (mode === "recent") {
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    }

    const scoreDiff = getPostScore(right) - getPostScore(left);

    if (Math.abs(scoreDiff) > 0.001) {
      return scoreDiff;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });

export function useCommunity({
  category,
  mode = "recent",
  pageSize = DEFAULT_PAGE_SIZE,
  enabled = true,
}: UseCommunityOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const postsRef = useRef<Post[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async ({ append = false }: { append?: boolean } = {}) => {
      if (!enabled) {
        setPosts([]);
        setLoading(false);
        setIsLoadingMore(false);
        setHasMore(false);
        setError(null);
        return;
      }

      try {
        setError(null);

        if (append) {
          setIsLoadingMore(true);
        } else {
          setLoading(true);
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const from = append ? postsRef.current.length : 0;
        const to = from + pageSize - 1;

        let query = supabase
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
            { count: "exact" },
          )
          .order("created_at", { ascending: false })
          .range(from, to);

        if (category) {
          query = query.eq("category", category);
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) {
          throw fetchError;
        }

        const nextPosts = transformPosts((data || []) as CommunityRawPost[], user?.id);
        const mergedPosts = append ? dedupePosts([...postsRef.current, ...nextPosts]) : nextPosts;

        const sortedPosts = sortPosts(mergedPosts, mode);
        postsRef.current = sortedPosts;
        setPosts(sortedPosts);
        setHasMore((count ?? 0) > (append ? from + nextPosts.length : nextPosts.length));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "No pudimos cargar la comunidad.");
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [category, enabled, mode, pageSize],
  );

  const refreshPosts = useCallback(async () => {
    await fetchPosts({ append: false });
  }, [fetchPosts]);

  const loadMorePosts = useCallback(async () => {
    if (!enabled || loading || isLoadingMore || !hasMore) {
      return;
    }

    await fetchPosts({ append: true });
  }, [enabled, fetchPosts, hasMore, isLoadingMore, loading]);

  const createPost = async (
    title: string,
    content: string,
    nextCategory: string,
    imageFile?: File | null,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Debes estar logueado para publicar");
    }

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("community-assets")
        .upload(filePath, imageFile);

      if (uploadError) {
        throw new Error("No pudimos subir la imagen");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("community-assets").getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const { data, error: createError } = await supabase
      .from("community_posts")
      .insert([{ title, content, category: nextCategory, user_id: user.id, image_url: imageUrl }])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return data;
  };

  const createReply = async (postId: string, content: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Debes estar logueado para responder");
    }

    const { error: createError } = await supabase
      .from("community_replies")
      .insert([{ post_id: postId, content, user_id: user.id }]);

    if (createError) {
      throw createError;
    }
  };

  const toggleLike = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Debes estar logueado para dar me gusta");
    }

    const { data: existingLike } = await supabase
      .from("community_post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("community_post_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        throw deleteError;
      }
    } else {
      const { error: insertError } = await supabase
        .from("community_post_likes")
        .insert({ post_id: postId, user_id: user.id });

      if (insertError) {
        throw insertError;
      }
    }
  };

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  useEffect(() => {
    if (!enabled) {
      setPosts([]);
      postsRef.current = [];
      setLoading(false);
      setIsLoadingMore(false);
      setHasMore(false);
      setError(null);
      return;
    }

    void fetchPosts({ append: false });
  }, [enabled, fetchPosts]);

  return {
    posts,
    loading,
    isLoadingMore,
    hasMore,
    error,
    refreshPosts,
    loadMorePosts,
    createPost,
    createReply,
    toggleLike,
  };
}
