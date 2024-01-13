import { ApiResponse } from "../types/res/BaseResponse";
import { NotificationResponse } from "../types/res/NotificationResponse";

export async function getNotifications(
  accessToken: string,
  direction: string,
  timestamp: number,
  signal: AbortSignal | undefined
): ApiResponse<NotificationResponse[]> {
  const res = await fetch(
    `/api/noti?direction=${direction}&timestamp=${timestamp}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      signal,
    }
  );
  if (res.status === 200) {
    const json = (await res.json()) as NotificationResponse[];
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
