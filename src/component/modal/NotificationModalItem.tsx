import { useNavigate } from "react-router-dom";
import { useAvatarImage } from "../../hook/useImage";
import { useUser } from "../../hook/useUser";
import { NotificationResponse } from "../../types/res/NotificationResponse";
import { translateTime } from "../../utils/timeTranslate";

type NotificationModalItemProps = {
  notification: NotificationResponse;
  closeModal: () => void;
};

export default function NotificationModalItem({
  notification,
  closeModal,
}: NotificationModalItemProps) {
  const { data: user } = useUser(notification.from, notification.from !== "");
  const { data: avatarUrl } = useAvatarImage(user?.avatarId || "", !!user);
  function moveAndCloseModal(link: string) {
    closeModal();
    navigate(link);
  }
  let message = <span></span>;
  if (notification.type === "LIKE_POST") {
    message = (
      <span>
        님이 당신의{" "}
        <span
          className="text-[#3EAEFF] hover:cursor-pointer"
          onClick={() => {
            moveAndCloseModal(notification.link);
          }}
        >
          포스트
        </span>
        를 좋아합니다
      </span>
    );
  } else if (notification.type === "LIKE_REPLY") {
    message = (
      <span>
        님이 당신의{" "}
        <span
          className="text-[#3EAEFF] hover:cursor-pointer"
          onClick={() => {
            moveAndCloseModal(notification.link);
          }}
        >
          댓글
        </span>
        을 좋아합니다
      </span>
    );
  } else if (notification.type === "FOLLOW") {
    message = <span>님이 당신을 팔로우 합니다</span>;
  } else if (notification.type === "REPLY_POST") {
    message = (
      <span>
        님이 당신의{" "}
        <span
          className="text-[#3EAEFF] hover:cursor-pointer"
          onClick={() => {
            moveAndCloseModal(notification.link);
          }}
        >
          포스트
        </span>
        에 댓글을 달았습니다
      </span>
    );
  } else if (notification.type === "REPLY_REPLY") {
    message = (
      <span>
        님이 당신의{" "}
        <span
          className="text-[#3EAEFF] hover:cursor-pointer"
          onClick={() => {
            moveAndCloseModal(notification.link);
          }}
        >
          댓글
        </span>
        에 답글을 달았습니다
      </span>
    );
  } else if (notification.type === "PWD_CHANGED") {
    message = <span>비밀번호가 변경되었습니다</span>;
  }
  const navigate = useNavigate();
  return (
    <div className="flex justify-start items-center py-2">
      {notification.from === "" ? null : (
        <div className="mr-2">
          <div
            onClick={() => {
              closeModal();
              navigate("/u/" + notification.from);
            }}
            className="w-8 h-8 rounded-full overflow-hidden hover:cursor-pointer"
          >
            <img
              src={avatarUrl || ""}
              alt=""
              hidden={!avatarUrl}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <div>
        {notification.from === "" ? null : (
          <span
            onClick={() => {
              closeModal();
              navigate("/u/" + notification.from);
            }}
            className="text-sm font-bold hover:cursor-pointer"
          >
            @{notification.from}
          </span>
        )}

        <span className="text-sm mr-2">{message}</span>
        <span className="text-[#A9A9A9] text-sm">
          {translateTime(notification.timestamp * 1000, [])}
        </span>
      </div>
    </div>
  );
}
