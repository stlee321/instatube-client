import { ReplyForm } from "../types/req/ReplyForm";
import { ReplyUpdateForm } from "../types/req/ReplyUpdateForm";
import { ApiResponse } from "../types/res/BaseResponse";
import { ReplyResponse } from "../types/res/ReplyResponse";
import { baseUrl } from "./baseEnv";

export async function getComment(
  timestamp: number,
  postId: string,
  size: number = 10,
  signal: AbortSignal | undefined,
  targetId?: string
): ApiResponse<ReplyResponse[]> {
  const url = `/api/reply?timestamp=${timestamp}&postId=${postId}&size=${size}`;
  const res = await fetch(
    baseUrl + url + (targetId ? `&targetId=${targetId}` : ""),
    {
      signal,
    }
  );
  if (res.status === 200) {
    const json = (await res.json()) as ReplyResponse[];
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

export async function writeComment(
  accessToken: string,
  form: ReplyForm
): ApiResponse<ReplyResponse> {
  if (form.targetId === undefined) {
    form.targetId = "";
  }
  const res = await fetch(baseUrl + "/api/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  if (res.status === 200) {
    const json = (await res.json()) as ReplyResponse;
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

export async function updateComment(
  accessToken: string,
  form: ReplyUpdateForm
): ApiResponse<ReplyResponse> {
  const res = await fetch(baseUrl + "/api/reply/" + form.replyId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  if (res.status === 200) {
    const json = (await res.json()) as ReplyResponse;
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

export async function deleteComment(
  accessToken: string,
  replyId: string
): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/reply/" + replyId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 204) {
    return {
      success: true,
      data: `댓글 삭제됨(id: ${replyId})`,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function getCommentCount(
  postId: string,
  signal: AbortSignal | undefined
): ApiResponse<number> {
  const res = await fetch(baseUrl + "/api/reply/count/p/" + postId, { signal });
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

export async function getReplyCount(
  targetId: string,
  signal: AbortSignal | undefined
): ApiResponse<number> {
  const res = await fetch(baseUrl + "/api/reply/count/r/" + targetId, {
    signal,
  });
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
