import {
  faAngleDown,
  faAngleUp,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Reply from "./Reply";
import { useReply, useReplyCount } from "../../hook/useComment";
import Button from "../common/Button";
import ReplySkeleton from "../skeleton/ReplySkeleton";

export default function ReplySection({
  postId,
  replyId,
}: {
  postId: string;
  replyId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: count } = useReplyCount(postId, replyId);
  const {
    data: replies,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReply(postId, replyId);
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
      {count && count > 0 ? (
        <div
          className="w-fit flex justify-start items-center rounded-full text-[#3EAEFF] hover:cursor-pointer select-none"
          onClick={() => {
            setIsOpen((o) => !o);
          }}
        >
          {isOpen ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
          <div className="w-2"></div>
          답글 {count}개
        </div>
      ) : null}
      {isOpen
        ? replies.pages.map((page) => {
            if (!page || page.replies.length === 0) {
              return null;
            }
            return (
              <React.Fragment key={page.replies[0].timestamp}>
                {page.replies.map((r) => {
                  return <Reply key={r.replyId} reply={r} parentId={replyId} />;
                })}
              </React.Fragment>
            );
          })
        : null}
      {isOpen && isFetchingNextPage ? (
        <div>
          <ReplySkeleton />
        </div>
      ) : null}
      {isOpen && hasNextPage ? (
        <div className="flex justify-start items-start mt-2">
          <Button
            name="더보기"
            buttonStyle="naked"
            onClick={() => {
              fetchNextPage();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
