import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as Unliked } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as Liked,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { useAppState } from "../../appState/AppState";
import { useLikePost, usePostLike, usePostLikedBy } from "../../hook/useLike";

export default function PostLike({ postId }: { postId: string }) {
  const authState = useAppState((state) => state.authState);
  const { data: liked } = usePostLikedBy(
    postId,
    authState.handle,
    authState.isLoggedIn
  );
  const { data: count } = usePostLike(postId);
  const likePostMutation = useLikePost();
  return (
    <div
      className="mr-2 hover:cursor-pointer flex justify-center items-center"
      onClick={() => {
        if (!authState.isLoggedIn) {
          alert("로그인 하세요");
          return;
        }
        likePostMutation.mutate({
          accessToken: authState.accessToken,
          handle: authState.handle,
          postId: postId,
          isLiking: liked || false,
        });
      }}
    >
      <div
        title="좋아요"
        className="hover:bg-[#f91880]/30 delay-75 rounded-full w-8 h-8 aspect-square flex justify-center items-center"
      >
        {likePostMutation.isLoading ? (
          <div className="animate-spin">
            <FontAwesomeIcon icon={faCircleNotch} size={"lg"} color="#f91880" />
          </div>
        ) : liked ? (
          <FontAwesomeIcon icon={Liked} size={"lg"} color="#f91880" />
        ) : (
          <FontAwesomeIcon icon={Unliked} size={"lg"} color="#f91880" />
        )}
      </div>
      {count && count > 0 ? (
        <>
          <div className="w-2"></div>
          {count}
        </>
      ) : null}
    </div>
  );
}
