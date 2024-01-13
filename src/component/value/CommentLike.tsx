import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as Unliked } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as Liked,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { useAppState } from "../../appState/AppState";
import {
  useCommentLike,
  useCommentLikedBy,
  useLikeComment,
} from "../../hook/useLike";

export default function CommentLike({ replyId }: { replyId: string }) {
  const authState = useAppState((state) => state.authState);
  const { data: liked } = useCommentLikedBy(
    replyId,
    authState.handle,
    authState.isLoggedIn
  );
  const { data: count } = useCommentLike(replyId);
  const likeCommentMutation = useLikeComment();
  return (
    <div
      className="hover:cursor-pointer flex justify-center items-center"
      onClick={() => {
        if (!authState.isLoggedIn) {
          alert("로그인 하세요");
          return;
        }
        likeCommentMutation.mutate({
          accessToken: authState.accessToken,
          handle: authState.handle,
          replyId: replyId,
          isLiking: liked || false,
        });
      }}
    >
      <div
        title="좋아요"
        className="hover:bg-[#f91880]/30 delay-75 rounded-full w-6 h-6 aspect-square flex justify-center items-center"
      >
        {likeCommentMutation.isLoading ? (
          <div className="animate-spin">
            <FontAwesomeIcon icon={faCircleNotch} size={"sm"} color="#f91880" />
          </div>
        ) : liked ? (
          <FontAwesomeIcon icon={Liked} size={"sm"} color="#f91880" />
        ) : (
          <FontAwesomeIcon icon={Unliked} size={"sm"} color="#f91880" />
        )}
      </div>
      <div className="w-2"></div>
      {count && count > 0 ? count : null}
    </div>
  );
}
