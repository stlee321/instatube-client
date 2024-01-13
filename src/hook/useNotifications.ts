import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../fetch/notificationFetch";
import { useState } from "react";

export function getNotificationsKey() {
  return ["notifications"];
}

export function useNotifications(accessToken: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: getNotificationsKey(),
    queryFn: async ({ pageParam: timestamp = Date.now(), signal }) => {
      let direction = "before";
      if (timestamp < 0) {
        direction = "after";
        timestamp = -timestamp;
      }
      const result = await getNotifications(
        accessToken,
        direction,
        timestamp,
        signal
      );
      if (result.success) {
        const len = result.data.length;
        let firstTimestamp = undefined;
        let lastTimestamp = undefined;
        if (len > 0) {
          firstTimestamp = result.data[0].timestamp;
          lastTimestamp = result.data[len - 1].timestamp;
        }
        return {
          notifications: result.data,
          firstTimestamp,
          lastTimestamp,
        };
      }
      return null;
    },
    enabled: enabled,
    getPreviousPageParam: (lastPage) =>
      lastPage?.firstTimestamp ? -(lastPage.firstTimestamp + 1) : undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.lastTimestamp ? lastPage.lastTimestamp - 1 : undefined,
  });
}

export function useHasNewNoti() {
  const [hasNewNoti, setHasNewNoti] = useState(false);
  return {
    hasNewNoti,
    setHasNewNoti,
  };
}
