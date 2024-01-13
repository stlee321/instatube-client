import React from "react";
import { useAppState } from "../../appState/AppState";
import { useNotifications } from "../../hook/useNotifications";
import NotificationModalItem from "./NotificationModalItem";
import { useModal } from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function NotificationModal() {
  const authState = useAppState((state) => state.authState);
  const notificationModal = useModal("notification");
  const {
    data: notifications,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    isFetchingPreviousPage,
  } = useNotifications(authState.accessToken, authState.isLoggedIn);
  if (isError) {
    return <div>오류. 다시 시도해 주세요.</div>;
  }
  if (isLoading) {
    return (
      <div>
        <div className="animate-spin text-[#3EAEFF] flex justify-center items-center">
          <FontAwesomeIcon icon={faCircleNotch} size={"sm"} />
        </div>
      </div>
    );
  }
  return (
    <div className="w-64 h-96 flex flex-col justify-start items-center">
      <div className="text-xl font-bold">알림</div>
      <div className="w-full h-full overflow-y-auto">
        {isFetchingPreviousPage ? (
          <div>
            <div className="animate-spin text-[#3EAEFF] flex justify-center items-center">
              <FontAwesomeIcon icon={faCircleNotch} size={"sm"} />
            </div>
          </div>
        ) : null}
        {notifications.pages.map((page, i) => {
          if (!page) {
            return null;
          }
          return (
            <React.Fragment key={`${page.firstTimestamp}_${i}`}>
              {page.notifications.map((n, i) => {
                return (
                  <NotificationModalItem
                    key={`${n.timestamp}_${i}`}
                    notification={n}
                    closeModal={() => {
                      notificationModal.close();
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
        {isFetchingNextPage ? (
          <div>
            <div className="animate-spin text-[#3EAEFF] flex justify-center items-center">
              <FontAwesomeIcon icon={faCircleNotch} size={"sm"} />
            </div>
          </div>
        ) : null}
        <div>
          <div
            onClick={() => {
              fetchNextPage();
            }}
            className="mt-4 w-fit flex justify-start items-center px-2 rounded-full bg-[#3EAEFF] text-white text-sm hover:cursor-pointer"
          >
            더보기
          </div>
        </div>
      </div>
    </div>
  );
}
