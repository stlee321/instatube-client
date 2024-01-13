import Button from "../common/Button";
import { useAppState } from "../../appState/AppState";
import { useUpdateComment } from "../../hook/useComment";
import { useRef, useState } from "react";
import { ReplyResponse } from "../../types/res/ReplyResponse";

export default function CommentEdit({
  reply,
  onCommentSuccess,
  onCancel,
}: {
  reply: ReplyResponse;
  onCommentSuccess: () => void;
  onCancel: () => void;
}) {
  const authState = useAppState((state) => state.authState);
  const [commentInputState, setCommentInputState] = useState({
    comment: reply.content,
    focus: false,
  });
  const { comment, focus } = commentInputState;
  const input = useRef<HTMLInputElement>(null);
  const updateCommentMutation = useUpdateComment();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="w-full">
        <input
          ref={input}
          className="w-full focus:outline-none"
          value={comment}
          onChange={(e) => {
            setCommentInputState((s) => ({ ...s, comment: e.target.value }));
          }}
          onFocus={() => {
            if (!authState.isLoggedIn) {
              alert("로그인 하세요");
              input.current?.blur();
              setCommentInputState(() => ({ comment: "", focus: false }));
              return;
            }
            setCommentInputState((s) => ({ ...s, focus: true }));
          }}
          onBlur={() => {
            setCommentInputState((s) => ({ ...s, focus: false }));
          }}
        />
        {focus ? (
          <div className="bg-[#3EAEFF] w-full h-[2px] rounded-full"></div>
        ) : (
          <div className="bg-[#EDEDED] w-full h-[2px] rounded-full"></div>
        )}
        <div className="flex justify-end items-center mt-2">
          <Button
            name="취소"
            buttonStyle="naked"
            onClick={() => {
              onCancel();
            }}
          />
          <Button
            name="수정"
            buttonStyle="solid"
            onClick={() => {
              if (!authState.isLoggedIn) {
                alert("로그인 하세요");
                return;
              }
              updateCommentMutation.mutate(
                {
                  accessToken: authState.accessToken,
                  postId: reply.postId,
                  form: {
                    replyId: reply.replyId,
                    content: commentInputState.comment,
                  },
                },
                {
                  onSuccess: () => {
                    setCommentInputState({ comment: "", focus: false });
                    onCommentSuccess();
                  },
                }
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
