import CommentInput from "./CommentInput";
import Comment from "./Comment";
import React from "react";
import { useComment, useCommentCount } from "../../hook/useComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver";
import CommentSkeleton from "../skeleton/CommentSkeleton";

export default function CommentSection({ postId }: { postId: string }) {
  const { data: count } = useCommentCount(postId);
  const {
    data: comments,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useComment(postId);
  const { setTarget } = useIntersectionObserver({ hasNextPage, fetchNextPage });
  if (isError) {
    return <div>error...</div>;
  }
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-spin">
          <FontAwesomeIcon icon={faCircleNotch} size={"lg"} color={"#3EAEFF"} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="font-semibold">댓글 {count || 0}개</div>
      <CommentInput postId={postId} onCommentSuccess={() => {}} />
      <div>
        {comments.pages.map((page) => {
          if (!page || page.comments.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={page.comments[0].timestamp}>
              {page.comments.map((r) => {
                return <Comment key={r.replyId} reply={r} />;
              })}
            </React.Fragment>
          );
        })}
      </div>
      {isFetchingNextPage ? (
        <div>
          <CommentSkeleton />
        </div>
      ) : null}
      <div ref={setTarget}></div>
    </div>
  );
}
