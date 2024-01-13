import { ApiResponse } from "../types/res/BaseResponse";
import { LikeResponse } from "../types/res/LikeResponse";
import { baseUrl } from "./baseEnv";

export async function getPostLikes(
  postId: string,
  signal: AbortSignal | undefined
): ApiResponse<LikeResponse> {
  const res = await fetch(baseUrl + "/api/like/count/p/" + postId, { signal });
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function getCommentLikes(
  replyId: string,
  signal: AbortSignal | undefined
): ApiResponse<LikeResponse> {
  const res = await fetch(baseUrl + "/api/like/count/r/" + replyId, { signal });
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function isPostLikedBy(
  postId: string,
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<LikeResponse> {
  const res = await fetch(
    baseUrl + "/api/like/p/" + postId + "?handle=" + handle,
    {
      signal,
    }
  );
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function isCommentLikedBy(
  replyId: string,
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<LikeResponse> {
  const res = await fetch(
    baseUrl + "/api/like/r/" + replyId + "?handle=" + handle,
    {
      signal,
    }
  );
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function likePost(
  accessToken: string,
  postId: string
): ApiResponse<LikeResponse> {
  const res = await fetch(baseUrl + "/api/like/p/" + postId, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function unlikePost(
  accessToken: string,
  postId: string
): ApiResponse<LikeResponse> {
  const res = await fetch(baseUrl + "/api/like/p/" + postId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function likeComment(
  accessToken: string,
  replyId: string
): ApiResponse<LikeResponse> {
  const res = await fetch(baseUrl + "/api/like/r/" + replyId, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function unlikeComment(
  accessToken: string,
  replyId: string
): ApiResponse<LikeResponse> {
  const res = await fetch(baseUrl + "/api/like/r/" + replyId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as LikeResponse;
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}
