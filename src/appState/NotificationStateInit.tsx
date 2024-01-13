import { useEffect } from "react";
import { useAppState } from "./AppState";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useNotifications } from "../hook/useNotifications";
import { useNotificationState } from "./NotificationState";

export default function NotificationStateInit() {
  const authState = useAppState((state) => state.authState);
  const { data: notifications, fetchPreviousPage } = useNotifications(
    authState.accessToken,
    authState.isLoggedIn
  );
  const { setHasNotification } = useNotificationState((state) => ({
    setHasNotification: state.setHasNotification,
  }));
  useEffect(() => {
    const ES = EventSourcePolyfill || NativeEventSource;
    let sse: EventSource | undefined;
    if (authState.isLoggedIn) {
      sse = new ES("/api/noti/sse", {
        headers: {
          Authorization: "Bearer " + authState.accessToken,
        },
      });
      sse.addEventListener("CONNECTED", function () {});
      sse.addEventListener("NEWNOTI", () => {
        if (!!notifications && notifications.pages.length > 0) {
          fetchPreviousPage();
        }
        setHasNotification(true);
      });
    } else {
      sse?.close();
    }
    return () => {
      sse?.close();
    };
  }, [authState, fetchPreviousPage, setHasNotification, notifications]);
  return null;
}
