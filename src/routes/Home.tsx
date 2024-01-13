import React from "react";
import Thumbnail from "../component/common/Thumbnail";
import { useRecommendedPostsQuery } from "../hook/usePost";
import { useAppState } from "../appState/AppState";
import { useIntersectionObserver } from "../hook/useIntersectionObserver";
import ThubmanilSkeleton from "../component/skeleton/ThumbnailSkeleton";

function Home() {
  const authState = useAppState((state) => state.authState);
  const {
    data: postInfos,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRecommendedPostsQuery(authState.accessToken);
  const { setTarget } = useIntersectionObserver({ hasNextPage, fetchNextPage });
  if (isError) {
    return <div>error...</div>;
  }
  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            return <ThubmanilSkeleton key={"post_skeleton_" + n} />;
          })}
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        {postInfos.pages.length === 0 ||
        postInfos.pages[0]?.postInfos.length === 0 ? (
          <div className="w-full flex justify-center items-center">
            포스트가 없습니다.
          </div>
        ) : null}
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {postInfos.pages.map((page) => {
            if (!page || page.postInfos.length === 0) {
              return null;
            }
            return (
              <React.Fragment key={page.postInfos[0].timestamp}>
                {page.postInfos.map((p) => {
                  return <Thumbnail key={p.postId} postId={p.postId} />;
                })}
              </React.Fragment>
            );
          })}
        </div>
        {isFetchingNextPage ? (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {[0, 1, 2].map((n) => {
              return <ThubmanilSkeleton key={"next_post_skeleton_" + n} />;
            })}
          </div>
        ) : null}
        <div ref={setTarget}></div>
      </div>
    </>
  );
}

export default Home;
