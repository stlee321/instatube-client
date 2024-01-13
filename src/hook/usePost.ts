import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deletePost,
  getFollowingPosts,
  getPopularPosts,
  getPost,
  getRecommendedPosts,
  getUserPostCount,
  getUserPosts,
  updatePost,
  writePost,
} from "../fetch/postFetch";
import { PostForm } from "../types/req/PostForm";
import { PostResponse } from "../types/res/PostResponse";

export function getPostKey(postId: string) {
  return ["post", postId];
}

export function usePost(
  postId: string,
  enabled: boolean = true,
  tracking: boolean = false
) {
  return useQuery({
    queryKey: getPostKey(postId),
    queryFn: async ({ signal }) => {
      const result = await getPost(postId, signal, tracking);
      if (result.success) {
        return result.data;
      }
      return null;
    },
    enabled: enabled,
  });
}

export function getRecommendedPostsKey() {
  return ["posts", "recommended"];
}

export function useRecommendedPostsQuery(accessToken?: string) {
  return useInfiniteQuery({
    queryKey: getRecommendedPostsKey(),
    queryFn: async ({ pageParam = Date.now() * 1000, signal }) => {
      const result = await getRecommendedPosts(
        pageParam,
        12,
        signal,
        accessToken
      );
      if (result.success) {
        const postInfos = result.data;
        const lastTimestamp =
          postInfos.length > 0
            ? postInfos[postInfos.length - 1].timestamp
            : undefined;
        return {
          postInfos,
          lastTimestamp,
        };
      }
      return undefined;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.lastTimestamp ? lastPage.lastTimestamp - 1 : undefined,
  });
}

export function getUserPostCountKey(handle: string) {
  return ["posts", handle, "count"];
}

export function useUserPostCount(handle: string, enabled: boolean = true) {
  return useQuery({
    queryKey: getUserPostCountKey(handle),
    queryFn: async ({ signal }) => {
      const result = await getUserPostCount(handle, signal);
      if (result.success) {
        return result.data;
      }
      return 0;
    },
    enabled: enabled,
  });
}

export function getUserPostKey(handle: string) {
  return ["posts", handle];
}

export function useUserPost(handle: string) {
  return useInfiniteQuery({
    queryKey: getUserPostKey(handle),
    queryFn: async ({ pageParam = Date.now() * 1000, signal }) => {
      const result = await getUserPosts(
        handle,
        pageParam,
        "before",
        12,
        signal
      );
      if (result.success) {
        const postInfos = result.data;
        const lastTimestamp =
          postInfos.length > 0
            ? postInfos[postInfos.length - 1].timestamp
            : undefined;
        return {
          postInfos,
          lastTimestamp,
        };
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage?.lastTimestamp ? lastPage.lastTimestamp - 1 : undefined,
  });
}

export function getFollowingPostsKey() {
  return ["posts", "following"];
}

export function useFollowingPosts(accessToken: string) {
  return useInfiniteQuery({
    queryKey: getFollowingPostsKey(),
    queryFn: async ({ pageParam = Date.now() * 1000, signal }) => {
      const result = await getFollowingPosts(
        "before",
        pageParam,
        12,
        accessToken,
        signal
      );
      if (result.success) {
        const postInfos = result.data;
        const lastTimestamp =
          postInfos.length > 0
            ? postInfos[postInfos.length - 1].timestamp
            : undefined;
        return {
          postInfos,
          lastTimestamp,
        };
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage?.lastTimestamp ? lastPage.lastTimestamp - 1 : undefined,
  });
}

export function getSidePostKey() {
  return ["posts", "side"];
}

export function useSidePost() {
  return useQuery({
    queryKey: getSidePostKey(),
    queryFn: async ({ signal }) => {
      const result = await getPopularPosts(signal);
      if (result.success) {
        return result.data;
      }
      return undefined;
    },
    cacheTime: 5 * 1000,
  });
}

type CreatePostProps = {
  accessToken: string;
  form: PostForm;
};

type UpdatePostProps = {
  accessToken: string;
  postId: string;
  form: PostForm;
};

type DeletePostProps = {
  accessToken: string;
  postId: string;
};

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, Error, CreatePostProps>({
    mutationFn: async ({ accessToken, form }) => {
      const result = await writePost(accessToken, form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (post) => {
      queryClient.setQueryData(getPostKey(post.postId), post);
      queryClient.invalidateQueries(getUserPostCountKey(post.handle));
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, Error, UpdatePostProps>({
    mutationFn: async ({ accessToken, postId, form }) => {
      const result = await updatePost(accessToken, postId, form);
      if (result.success) return result.data;
      throw new Error(result.error);
    },
    onSuccess: (post) => {
      queryClient.setQueryData(getPostKey(post.postId), post);
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, DeletePostProps>({
    mutationFn: async ({ accessToken, postId }) => {
      const result = await deletePost(accessToken, postId);
      if (result.success) {
        return postId;
      }
      throw new Error(result.error);
    },
    onSuccess: (postId) => {
      queryClient.removeQueries(getPostKey(postId));
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
