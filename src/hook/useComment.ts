import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteComment,
  getComment,
  getCommentCount,
  getReplyCount,
  updateComment,
  writeComment,
} from "../fetch/commentFetch";
import { ReplyForm } from "../types/req/ReplyForm";
import { ReplyResponse } from "../types/res/ReplyResponse";
import { ReplyUpdateForm } from "../types/req/ReplyUpdateForm";

export function getCommentCountKey(postId: string) {
  return ["post", postId, "comment", "count"];
}

export function useCommentCount(postId: string) {
  return useQuery({
    queryKey: getCommentCountKey(postId),
    queryFn: async ({ signal }) => {
      const result = await getCommentCount(postId, signal);
      return result.success ? result.data : 0;
    },
  });
}

export function getCommentKey(postId: string) {
  return ["post", postId, "comment"];
}

export function useComment(postId: string) {
  return useInfiniteQuery({
    queryKey: getCommentKey(postId),
    queryFn: async ({ pageParam = 0, signal }) => {
      const result = await getComment(pageParam, postId, 10, signal);
      if (result.success) {
        const comments = result.data;
        const lastTimestamp =
          comments && comments.length > 0
            ? comments[comments.length - 1].timestamp
            : 0;
        return {
          comments: comments,
          lastTimestamp: lastTimestamp,
        };
      }
      return undefined;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.lastTimestamp ? lastPage.lastTimestamp + 1 : undefined,
  });
}

export function getReplyCountKey(postId: string, targetId: string) {
  return ["post", postId, "comment", targetId, "reply", "count"];
}

export function useReplyCount(postId: string, targetId: string) {
  return useQuery({
    queryKey: getReplyCountKey(postId, targetId),
    queryFn: async ({ signal }) => {
      const result = await getReplyCount(targetId, signal);
      return result.success ? result.data : 0;
    },
  });
}

export function getReplyKey(postId: string, targetId: string) {
  return ["post", postId, "comment", targetId, "reply"];
}

export function useReply(postId: string, targetId: string) {
  return useInfiniteQuery({
    queryKey: getReplyKey(postId, targetId),
    queryFn: async ({ pageParam = 0, signal }) => {
      const result = await getComment(pageParam, postId, 10, signal, targetId);
      if (result.success) {
        const replies = result.data;
        const lastTimestamp =
          replies.length > 0 ? replies[replies.length - 1].timestamp : 0;
        return {
          replies: replies,
          lastTimestamp: lastTimestamp,
        };
      }
      return undefined;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.lastTimestamp ? lastPage.lastTimestamp + 1 : undefined,
  });
}

type CreateCommentProps = {
  accessToken: string;
  form: ReplyForm;
};

type UpdateCommentProps = {
  accessToken: string;
  postId: string;
  targetId?: string;
  form: ReplyUpdateForm;
};

type DeleteCommentProps = {
  accessToken: string;
  postId: string;
  targetId?: string;
  replyId: string;
};

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation<ReplyResponse, Error, CreateCommentProps>({
    mutationFn: async ({ accessToken, form }: CreateCommentProps) => {
      const result = await writeComment(accessToken, form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data, { form }) => {
      data;
      queryClient.invalidateQueries({
        queryKey: getCommentCountKey(form.postId),
      });
      queryClient.invalidateQueries({ queryKey: getCommentKey(form.postId) });
      if (form.targetId) {
        queryClient.invalidateQueries({
          queryKey: getReplyCountKey(form.postId, form.targetId),
        });
        queryClient.invalidateQueries({
          queryKey: getReplyKey(form.postId, form.targetId),
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation<ReplyResponse, Error, UpdateCommentProps>({
    mutationFn: async ({ accessToken, form }) => {
      const result = await updateComment(accessToken, form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data, { postId, targetId }) => {
      data;
      queryClient.invalidateQueries({ queryKey: getCommentKey(postId) });
      queryClient.invalidateQueries({ queryKey: getCommentCountKey(postId) });
      if (targetId) {
        queryClient.invalidateQueries({
          queryKey: getReplyCountKey(postId, targetId),
        });
        queryClient.invalidateQueries({
          queryKey: getReplyKey(postId, targetId),
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, DeleteCommentProps>({
    mutationFn: async ({ accessToken, replyId }) => {
      const result = await deleteComment(accessToken, replyId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data, { postId, targetId }) => {
      data;
      queryClient.invalidateQueries({ queryKey: getCommentKey(postId) });
      queryClient.invalidateQueries({ queryKey: getCommentCountKey(postId) });
      if (targetId) {
        queryClient.invalidateQueries({
          queryKey: getReplyKey(postId, targetId),
        });
        queryClient.invalidateQueries({
          queryKey: getReplyCountKey(postId, targetId),
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
