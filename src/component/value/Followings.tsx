import { useModal } from "../modal/Modal";
import { useFollowingsCount } from "../../hook/useFollow";

export default function Followings({ handle }: { handle: string }) {
  const followings = useModal("follow");
  const { data: count } = useFollowingsCount(handle);
  return (
    <div
      className="font-semibold hover:cursor-pointer"
      onClick={() => {
        followings.open({ tab: "following", handle: handle });
      }}
    >
      팔로잉 {count || 0}
    </div>
  );
}
