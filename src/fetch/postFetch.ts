import { PostForm } from "../types/req/PostForm";
import { ApiResponse } from "../types/res/BaseResponse";
import { PostInfo } from "../types/res/PostInfo";
import { PostResponse } from "../types/res/PostResponse";
import { baseUrl } from "./baseEnv";

export async function getRecommendedPosts(
  timestamp: number,
  size: number,
  signal: AbortSignal | undefined,
  accessToken?: string
): ApiResponse<PostInfo[]> {
  const res = await fetch(
    baseUrl + "/api/post/recommend?timestamp=" + timestamp + "&size=" + size,
    {
      method: "GET",
      headers: accessToken
        ? {
            Authorization: "Bearer " + accessToken,
          }
        : undefined,
      signal,
    }
  );
  if (res.status === 200) {
    const json = (await res.json()) as PostInfo[];
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

export async function getFollowingPosts(
  direction: string,
  timestamp: number,
  size: number = 12,
  accessToken: string,
  signal: AbortSignal | undefined
): ApiResponse<PostInfo[]> {
  const url = `/api/post/following?dir=${direction}&timestamp=${timestamp}&size=${size}`;
  const res = await fetch(baseUrl + url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as PostInfo[];
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

export async function getPopularPosts(
  signal: AbortSignal | undefined
): ApiResponse<string[]> {
  const res = await fetch(baseUrl + "/api/post/popular?size=6", { signal });
  if (res.status === 200) {
    const json = (await res.json()) as string[];
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

export async function getUserPosts(
  handle: string,
  timestamp: number,
  direction: string,
  size: number = 12,
  signal: AbortSignal | undefined
): ApiResponse<PostInfo[]> {
  const url = `/api/post/u/${handle}?dir=${direction}&timestamp=${timestamp}&size=${size}`;
  const res = await fetch(baseUrl + url, { signal });
  if (res.status === 200) {
    const json = (await res.json()) as PostInfo[];
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

export async function getUserPostCount(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<number> {
  const res = await fetch("/api/post/u/count/" + handle, { signal });
  if (res.status === 200) {
    const text = await res.text();
    const count = Number(text);
    if (isNaN(count)) {
      return {
        success: false,
        error: `not a number(${text})`,
      };
    }
    return {
      success: true,
      data: count,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function getPost(
  postId: string,
  signal: AbortSignal | undefined,
  tracking: boolean
): ApiResponse<PostResponse> {
  const res = await fetch(
    baseUrl + "/api/post/p/" + postId + (tracking ? "?tr=1" : ""),
    { signal }
  );
  if (res.status === 200) {
    const json = (await res.json()) as PostResponse;
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

export async function writePost(
  accessToken: string,
  form: PostForm
): ApiResponse<PostResponse> {
  const res = await fetch(baseUrl + "/api/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  if (res.status === 201) {
    const json = (await res.json()) as PostResponse;
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

export async function updatePost(
  accessToken: string,
  postId: string,
  form: PostForm
): ApiResponse<PostResponse> {
  const res = await fetch(baseUrl + "/api/post/p/" + postId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  if (res.status === 200) {
    const json = (await res.json()) as PostResponse;
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

export async function deletePost(
  accessToken: string,
  postId: string
): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/post/p/" + postId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 204) {
    return {
      success: true,
      data: `포스트 삭제됨(id:${postId})`,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}
