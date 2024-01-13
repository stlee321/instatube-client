import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCommentLikes,
  getPostLikes,
  isCommentLikedBy,
  isPostLikedBy,
  likeComment,
  likePost,
  unlikeComment,
  unlikePost,
} from "../fetch/likeFetch";
import { LikeResponse } from "../types/res/LikeResponse";

export function getPostLikeKey(postId: string) {
  return ["post", postId, "like", "count"];
}

export function usePostLike(postId: string) {
  return useQuery({
    queryKey: getPostLikeKey(postId),
    queryFn: async ({ signal }) => {
      const result = await getPostLikes(postId, signal);
      return result.success ? result.data.count : 0;
    },
  });
}

export function getCommentLikeKey(replyId: string) {
  return ["comment", replyId, "like", "count"];
}

export function useCommentLike(replyId: string) {
  return useQuery({
    queryKey: getCommentLikeKey(replyId),
    queryFn: async ({ signal }) => {
      const result = await getCommentLikes(replyId, signal);
      return result.success ? result.data.count : 0;
    },
  });
}

export function getPostLikedByKey(postId: string, handle: string) {
  return ["post", postId, "like", "by", handle];
}

export function usePostLikedBy(
  postId: string,
  handle: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: getPostLikedByKey(postId, handle),
    queryFn: async ({ signal }) => {
      const result = await isPostLikedBy(postId, handle, signal);
      return result.success ? result.data.result : false;
    },
    enabled: enabled,
  });
}

export function getCommentLikedByKey(replyId: string, handle: string) {
  return ["comment", replyId, "like", "by", handle];
}

export function useCommentLikedBy(
  replyId: string,
  handle: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: getCommentLikedByKey(replyId, handle),
    queryFn: async ({ signal }) => {
      const result = await isCommentLikedBy(replyId, handle, signal);
      return result.success ? result.data.result : false;
    },
    enabled: enabled,
  });
}

type LikePostProps = {
  accessToken: string;
  handle: string;
  postId: string;
  isLiking: boolean;
};

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation<LikeResponse, Error, LikePostProps>({
    mutationFn: async ({ accessToken, postId, isLiking }) => {
      const result = isLiking
        ? await unlikePost(accessToken, postId)
        : await likePost(accessToken, postId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data, { handle, postId }) => {
      data;
      queryClient.invalidateQueries({ queryKey: getPostLikeKey(postId) });
      queryClient.invalidateQueries({
        queryKey: getPostLikedByKey(postId, handle),
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

type LikeCommentProps = {
  accessToken: string;
  handle: string;
  replyId: string;
  isLiking: boolean;
};

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation<LikeResponse, Error, LikeCommentProps>({
    mutationFn: async ({ accessToken, replyId, isLiking }) => {
      const result = isLiking
        ? await unlikeComment(accessToken, replyId)
        : await likeComment(accessToken, replyId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data, { handle, replyId }) => {
      data;
      queryClient.invalidateQueries({ queryKey: getCommentLikeKey(replyId) });
      queryClient.invalidateQueries({
        queryKey: getCommentLikedByKey(replyId, handle),
      });
    },
  });
}
