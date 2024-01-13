import { useModal } from "../modal/Modal";
import { useFollowersCount } from "../../hook/useFollow";

export default function Followers({ handle }: { handle: string }) {
  const followers = useModal("follow");
  const { data: count } = useFollowersCount(handle);
  return (
    <div
      className="font-semibold hover:cursor-pointer"
      onClick={() => {
        followers.open({ tab: "follower", handle: handle });
      }}
    >
      팔로워 {count || 0}
    </div>
  );
}
