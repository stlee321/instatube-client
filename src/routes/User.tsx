import { Navigate, useParams } from "react-router-dom";
import Thumbnail from "../component/common/Thumbnail";
import Followers from "../component/value/Followers";
import Followings from "../component/value/Followings";
import Follow from "../component/value/Follow";
import { useUserPost, useUserPostCount } from "../hook/usePost";
import { useUser } from "../hook/useUser";
import { useAvatarImage } from "../hook/useImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useIntersectionObserver } from "../hook/useIntersectionObserver";

export default function User() {
  const { handle } = useParams();
  const { data: user, isLoading: isUserLoading } = useUser(handle || "");
  const {
    data: postInfos,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUserPost(handle || "");
  const { setTarget } = useIntersectionObserver({ hasNextPage, fetchNextPage });
  const {
    data: avatarUrl,
    isLoading: isAvatarLoading,
    isError: isAvatarError,
  } = useAvatarImage(
    user?.avatarId || "",
    !isUserLoading && !!user && user.avatarId !== ""
  );
  const { data: count } = useUserPostCount(
    handle || "",
    !isUserLoading && !!user
  );
  if (handle === undefined) {
    return <Navigate to={"/"} />;
  }
  if (isUserLoading) {
    return <div>...</div>;
  }
  if (!user) {
    return (
      <div className="w-full mt-32">
        <div className="flex justify-center items-start">없는 유저 입니다.</div>
      </div>
    );
  }
  return (
    <div className="w-full mt-32">
      <div className="block md:flex md:justify-center md:items-center lg:justify-start mb-16">
        <div className="flex justify-center md:mr-16 mb-16 md:mb-0">
          <div className="relative w-36 h-36 rounded-full overflow-hidden bg-[#EDEDED]">
            <img
              className="w-full h-full object-cover"
              src={avatarUrl || ""}
              alt=""
              hidden={
                avatarUrl === undefined || isAvatarLoading || isAvatarError
              }
            />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <div className="flex justify-start items-center mb-4">
              <div className="mr-8 font-bold">@{user.handle}</div>
              <div>
                <Follow handle={user.handle} />
              </div>
            </div>
            <div className="flex justify-start items-center mb-4">
              <div className="mr-12 font-semibold">게시글 {count || 0} </div>
              <div className="mr-12">
                <Followers handle={user.handle} />
              </div>
              <div>
                <Followings handle={user.handle} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-start">
        {isError ? (
          <div>error...</div>
        ) : isLoading ? (
          <div className="w-full mt-32 flex justify-center items-start">
            <div className="animate-spin">
              <FontAwesomeIcon
                icon={faCircleNotch}
                size={"lg"}
                color={"#3EAEFF"}
              />
            </div>
          </div>
        ) : postInfos.pages.length === 0 ||
          postInfos.pages[0]?.postInfos.length === 0 ? (
          <div>포스트가 없습니다.</div>
        ) : (
          <div className="w-full">
            <div className="w-full grid grid-cols-3 gap-1 md:gap-2">
              {postInfos.pages.map((page) => {
                if (!page || page.postInfos.length === 0) {
                  return null;
                }
                return page.postInfos.map((p) => {
                  return <Thumbnail key={p.postId} postId={p.postId} />;
                });
              })}
            </div>
            {isFetchingNextPage ? (
              <div className="w-full flex justify-center items-start">
                <div className="animate-spin">
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    size={"lg"}
                    color={"#3EAEFF"}
                  />
                </div>
              </div>
            ) : null}
            <div ref={setTarget}></div>
          </div>
        )}
      </div>
    </div>
  );
}
