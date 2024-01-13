import { Link } from "react-router-dom";
import { useModal } from "./Modal";
import Follow from "../value/Follow";
import { useUser } from "../../hook/useUser";
import { useAvatarImage } from "../../hook/useImage";

export default function FollowModalItem({ handle }: { handle: string }) {
  const followModal = useModal("follow");
  const { data: user } = useUser(handle);
  const { data: avatarUrl } = useAvatarImage(user?.avatarId || "", !!user);
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex justify-center items-center">
        <div className="mr-4">
          <Link
            to={"/u/" + handle}
            onClick={() => {
              followModal.close();
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#EDEDED] relative overflow-hidden">
              <img
                src={avatarUrl || ""}
                alt=""
                hidden={!avatarUrl}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <Link
            to={"/u/" + handle}
            onClick={() => {
              followModal.close();
            }}
          >
            <div className="font-semibold">@{handle}</div>
          </Link>
        </div>
      </div>
      <div>
        <Follow handle={handle} />
      </div>
    </div>
  );
}
