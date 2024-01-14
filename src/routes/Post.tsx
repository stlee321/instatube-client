import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faEllipsis,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import CommentSection from "../component/comment/CommentSection";
import Thumbnail from "../component/common/Thumbnail";
import PostLike from "../component/value/PostLike";
import Follow from "../component/value/Follow";
import {useState} from "react";
import {
  getUserPostCountKey,
  useDeletePost,
  usePost,
  useSidePost,
} from "../hook/usePost";
import {useAppState} from "../appState/AppState";
import {useUser} from "../hook/useUser";
import {useAvatarImage, usePostImage} from "../hook/useImage";
import {buildContent} from "../utils/ContentBuilder";
import {translateTime} from "../utils/timeTranslate";
import {useQueryClient} from "@tanstack/react-query";

export default function Post() {
  const authState = useAppState((state) => state.authState);
  const [optionOn, setOptionOn] = useState(false);
  const {postId} = useParams();
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = usePost(postId || "", postId !== undefined, true);
  const {data: imageUrl} = usePostImage(post?.imageId || "", !!post);
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUser(post?.handle || "", !!post);
  const isMe = authState.isLoggedIn && user && authState.handle === user.handle;
  const {data: avatarUrl} = useAvatarImage(user?.avatarId || "", !!user);
  const {data: sidePosts} = useSidePost();
  const navigate = useNavigate();
  const deletePostMutation = useDeletePost();
  const queryClient = useQueryClient();
  if (postId === undefined) {
    return <Navigate to={"/"} />;
  }
  if (isPostLoading) {
    return (
      <div className="w-full mt-24 md:mt-32">
        <div className="flex justify-center items-start">로딩중</div>
      </div>
    );
  }
  if (isPostError) {
    return (
      <div className="w-full mt-24 md:mt-32">
        <div className="flex justify-center items-start">
          포스트 로드 중 오류. 새로고침 하세요
        </div>
      </div>
    );
  }
  if (post === null) {
    return (
      <div className="w-full mt-24 md:mt-32">
        <div className="flex justify-center items-start">
          없는 포스트 입니다.
        </div>
      </div>
    );
  }
  return (
    <div className="w-full mt-24 md:mt-32 block md:flex md:justify-center md:itesm-start">
      <div className="w-full md:w-3/4 pr-0 md:pr-4">
        <div className="w-full">
          <div className="aspect-square relative">
            <img
              src={imageUrl || ""}
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="px-2 lg:px-0 text-2xl font-bold my-8">{post.title}</div>
        <div className="px-2 lg:px-0 block md:flex md:justify-between md:items-center">
          {isUserLoading ? (
            <div className="w-full h-32 flex justify-center items-center">
              <FontAwesomeIcon
                className="animate-spin"
                icon={faCircleNotch}
                size={"2xl"}
              />
            </div>
          ) : isUserError ? (
            <div>유저 정보 로드 실패. 새로고침 하세요</div>
          ) : (
            <div className="flex justify-start items-center">
              <Link to={"/u/" + post.handle}>
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAEAEA] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={avatarUrl}
                      alt=""
                      hidden={user === null}
                    />
                  </div>
                </div>
              </Link>
              <div className="mr-4">
                <Link to={"/u/" + post.handle}>
                  <div className="font-bold">@{post.handle}</div>
                </Link>
              </div>
              <div>
                <Follow handle={post.handle} />
              </div>
            </div>
          )}
          <div className="flex justify-end items-center">
            <div className="mr-2">
              <PostLike postId={post.postId} />
            </div>
            <div
              className="mr-2 hover:cursor-pointer aspect-square w-8 h-8 hover:bg-slate-400/30 delay-75 rounded-full flex justify-center items-center"
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(
                  () => {
                    alert("주소가 복사되었습니다.");
                  },
                  () => {
                    alert("다시 시도해 주세요.");
                  }
                );
              }}
            >
              <FontAwesomeIcon icon={faShareFromSquare} size={"lg"} />
            </div>
            <div className="relative">
              <div
                title="옵션"
                className="hover:cursor-pointer aspect-square w-8 h-8 hover:bg-slate-400/30 delay-75 rounded-full flex justify-center items-center"
                onClick={() => {
                  if (!isMe) return;
                  setOptionOn((o) => !o);
                }}
              >
                <FontAwesomeIcon icon={faEllipsis} size={"lg"} />
              </div>
              {isMe && optionOn ? (
                <div className="absolute right-0 w-24 bg-white rounded-lg border-[1px] border-[#A9A9A9] overflow-hidden">
                  <div
                    className="py-2 px-2 hover:cursor-pointer hover:bg-[#EDEDED]"
                    onClick={() => {
                      setOptionOn(false);
                      navigate("/p/" + post.postId + "/edit");
                    }}
                  >
                    수정
                  </div>
                  <div
                    className="py-2 px-2 hover:cursor-pointer hover:bg-[#EDEDED]"
                    onClick={() => {
                      if (!authState.isLoggedIn) {
                        alert("로그인 하세요");
                        return;
                      }
                      if (!confirm("정말 삭제하시겠습니까?")) {
                        setOptionOn(false);
                        return;
                      }
                      deletePostMutation.mutate(
                        {
                          accessToken: authState.accessToken,
                          postId: postId,
                        },
                        {
                          onSuccess: () => {
                            queryClient.invalidateQueries(
                              getUserPostCountKey(authState.handle)
                            );
                            navigate("/");
                          },
                          onError: () => {
                            alert("다시 시도해 보세요");
                          },
                        }
                      );
                    }}
                  >
                    삭제
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="px-2 lg:px-0 mt-4 text-[#A9A9A9]">
          {translateTime(post.timestamp, post.createdAt)}
        </div>
        <div className="px-2 lg:px-0 mt-2">{buildContent(post.content)}</div>
        <div className="px-2 lg:px-0 my-4">
          <CommentSection postId={post.postId} />
        </div>
      </div>
      <div className="w-full md:w-1/4">
        <div className="grid grid-cols-3 md:grid-cols-1 gap-1 md:gap-2">
          {sidePosts?.map((postId) => {
            return <Thumbnail key={postId} postId={postId} />;
          })}
        </div>
      </div>
    </div>
  );
}
