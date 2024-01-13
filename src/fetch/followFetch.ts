import { ApiResponse } from "../types/res/BaseResponse";
import { FollowResponse } from "../types/res/FollowResponse";
import { baseUrl } from "./baseEnv";

export async function follow(
  accessToken: string,
  handle: string
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/" + handle, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function unfollow(
  accessToken: string,
  handle: string
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/" + handle, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function getFollowers(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/follower/" + handle, {
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function getFollowersCount(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/follower/count/" + handle, {
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function getFollowings(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/following/" + handle, {
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function getFollowingsCount(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/following/count/" + handle, {
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function amIFollowing(
  accessToken: string,
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<FollowResponse> {
  const res = await fetch(baseUrl + "/api/follow/is/following/" + handle, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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

export async function amIFollowingMany(
  accessToken: string,
  handles: string[]
): ApiResponse<FollowResponse> {
  const url = `/api/follow/is/following?handles=${handles.join(",")}`;
  const res = await fetch(baseUrl + url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    const json = (await res.json()) as FollowResponse;
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
