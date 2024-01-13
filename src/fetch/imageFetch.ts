import { ApiResponse } from "../types/res/BaseResponse";
import { ImageResponse } from "../types/res/ImageResponse";
import { baseUrl } from "./baseEnv";

export async function getPostImage(
  imageId: string,
  signal: AbortSignal | undefined
): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/img/p/" + imageId, { signal });
  if (res.status === 200) {
    const imageUrl = await res.text();
    return {
      success: true,
      data: imageUrl,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function getAvatarImage(
  avatarId: string,
  signal: AbortSignal | undefined
): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/img/u/" + avatarId, { signal });
  if (res.status === 200) {
    const avatarUrl = await res.text();
    return {
      success: true,
      data: avatarUrl,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function uploadImage(
  accessToken: string,
  image: File
): ApiResponse<ImageResponse> {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(baseUrl + "/api/img/post", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: formData,
  });
  if (res.status === 200) {
    const json = (await res.json()) as ImageResponse;
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

export async function updateMyAvatarImage(
  accessToken: string,
  image: File
): ApiResponse<ImageResponse> {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(baseUrl + "/api/img/avatar/setme", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: formData,
  });
  if (res.status === 200) {
    const json = (await res.json()) as ImageResponse;
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

export async function uploadMyAvatarImage(
  image: File
): ApiResponse<ImageResponse> {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(baseUrl + "/api/img/avatar/signin", {
    method: "POST",
    body: formData,
  });
  if (res.status === 200) {
    const json = (await res.json()) as ImageResponse;
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
