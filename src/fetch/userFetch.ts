import { SetMeForm } from "../types/req/SetMeForm";
import { ApiResponse } from "../types/res/BaseResponse";
import { UserInfoResponse } from "../types/res/UserInfoResponse";
import { baseUrl } from "./baseEnv";

export async function setMe(
  accessToken: string,
  form: SetMeForm
): ApiResponse<UserInfoResponse> {
  const res = await fetch(baseUrl + "/api/user/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  if (res.status === 200) {
    const json = (await res.json()) as UserInfoResponse;
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

export async function getMe(
  accessToken: string,
  signal: AbortSignal | undefined
): ApiResponse<UserInfoResponse> {
  const res = await fetch(baseUrl + "/api/user/me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    signal,
  });
  if (res.status === 200) {
    const json = (await res.json()) as UserInfoResponse;
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

export async function getUser(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<UserInfoResponse> {
  const res = await fetch(baseUrl + "/api/user/" + handle, { signal });
  if (res.status === 200) {
    const json = (await res.json()) as UserInfoResponse;
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
