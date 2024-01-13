import { useRef, useState } from "react";
import Button from "../common/Button";
import { useAppState } from "../../appState/AppState";
import { useCreateComment } from "../../hook/useComment";
import { useMe } from "../../hook/useUser";
import { useAvatarImage } from "../../hook/useImage";
import { reply_max_length } from "../../utils/constraint";
import ButtonLoading from "../loading/ButtonLoading";

export default function CommentInput({
  postId,
  onCommentSuccess,
  target,
  targetId,
}: {
  postId: string;
  target?: string;
  targetId?: string;
  onCommentSuccess: () => void;
}) {
  const authState = useAppState((state) => state.authState);
  const { data: me } = useMe(authState.accessToken, authState.isLoggedIn);
  const { data: avatarUrl } = useAvatarImage(me?.avatarId || "", !!me);
  const [commentInputState, setCommentInputState] = useState({
    comment: "",
    focus: false,
  });
  const { comment, focus } = commentInputState;
  const input = useRef<HTMLInputElement>(null);
  const createCommentMutation = useCreateComment();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="mr-4">
        <div className="relative overflow-hidden w-12 h-12 rounded-full bg-[#EDEDED]">
          <img
            className="w-full h-full object-cover absolute top-0 left-0"
            src={avatarUrl || ""}
            alt=""
            hidden={!avatarUrl}
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-start items-center">
          {target ? (
            <div className="px-2 my-2 rounded-full bg-[#3EAEFF] text-white mr-2">
              @{target}
            </div>
          ) : null}
          <input
            ref={input}
            className="w-full focus:outline-none"
            placeholder="댓글 추가..."
            value={comment}
            onChange={(e) => {
              if (e.target.value.length > reply_max_length) return;
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
        </div>
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
              setCommentInputState({ comment: "", focus: false });
            }}
          />
          {createCommentMutation.isLoading ? (
            <ButtonLoading />
          ) : (
            <Button
              name="댓글"
              buttonStyle="solid"
              onClick={() => {
                if (!authState.isLoggedIn) {
                  alert("로그인 하세요");
                  return;
                }
                if (commentInputState.comment === "") {
                  alert("댓글을 입력하세요");
                  return;
                }
                createCommentMutation.mutate(
                  {
                    accessToken: authState.accessToken,
                    form: {
                      handle: authState.handle,
                      content:
                        (target ? `@${target} ` : "") +
                        commentInputState.comment,
                      postId,
                      targetId,
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
          )}
        </div>
      </div>
    </div>
  );
}
