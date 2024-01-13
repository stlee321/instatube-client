import { useState } from "react";
import { ReplyResponse } from "../../types/res/ReplyResponse";
import { Link } from "react-router-dom";
import CommentInput from "./CommentInput";
import CommentLike from "../value/CommentLike";
import { useUser } from "../../hook/useUser";
import { useAvatarImage } from "../../hook/useImage";
import { useAppState } from "../../appState/AppState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useDeleteComment } from "../../hook/useComment";
import CommentEdit from "./CommentEdit";
import { translateTime } from "../../utils/timeTranslate";
import { buildContent } from "../../utils/ContentBuilder";

export default function Reply({
  reply,
  parentId,
}: {
  reply: ReplyResponse;
  parentId: string;
}) {
  const authState = useAppState((state) => state.authState);
  const isMe = authState.isLoggedIn && reply.handle === authState.handle;
  const [inputOn, setInputOn] = useState(false);
  const [optionOn, setOptionOn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: user } = useUser(reply.handle);
  const { data: avatarUrl } = useAvatarImage(user?.avatarId || "", !!user);
  const deleteCommentMutation = useDeleteComment();
  return (
    <>
      <div className="my-4 flex justify-start items-start">
        <Link to={"/u/" + reply.handle}>
          <div className="mr-4">
            <div className="w-8 h-8 rounded-full bg-[#EDEDED] relative overflow-hidden">
              <img
                src={avatarUrl || ""}
                alt=""
                hidden={!avatarUrl}
                className="w-full h-full object-cover absolute top-0 left-0"
              />
            </div>
          </div>
        </Link>
        <div className="w-full">
          {!isEditing ? (
            <>
              <div className="flex justify-start items-center">
                <Link to={"/u/" + reply.handle}>
                  <div className="font-semibold mr-2">@{reply.handle}</div>
                </Link>
                <div className="text-[#A9A9A9]">
                  {translateTime(reply.timestamp, reply.createdAt)}
                </div>
              </div>
              <div className="py-2 flex justify-between items-center">
                <div className="w-full">{buildContent(reply.content)}</div>
                <div className="relative">
                  <div
                    title="옵션"
                    className="hover:cursor-pointer w-6 h-6 rounded-full hover:bg-slate-400/30 delay-75 flex justify-center items-center"
                    onClick={() => {
                      if (isMe) {
                        setOptionOn((o) => !o);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faEllipsis} size={"sm"} />
                  </div>
                  {isMe && optionOn ? (
                    <div className="absolute right-0 w-12 bg-white rounded-lg border-[1px] border-[#A9A9A9] overflow-hidden">
                      <div
                        className="py-2 px-2 text-sm hover:cursor-pointer hover:bg-[#EDEDED]"
                        onClick={() => {
                          setIsEditing(true);
                          setOptionOn(false);
                        }}
                      >
                        수정
                      </div>
                      <div
                        className="py-2 px-2 text-sm hover:cursor-pointer hover:bg-[#EDEDED]"
                        onClick={() => {
                          if (!authState.isLoggedIn) {
                            alert("로그인 하세요");
                            return;
                          }
                          if (!isMe) {
                            return;
                          }
                          if (!confirm("정말 삭제하시겠습니까?")) {
                            setOptionOn(false);
                            return;
                          }
                          deleteCommentMutation.mutate(
                            {
                              accessToken: authState.accessToken,
                              postId: reply.postId,
                              replyId: reply.replyId,
                            },
                            {
                              onError: () => {
                                alert("다시 시도해 주세요");
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
              <div className="flex justify-start items-center mb-2">
                <div className="mr-4">
                  <CommentLike replyId={reply.replyId} />
                </div>
                <div
                  className="hover:cursor-pointer select-none"
                  onClick={() => setInputOn((o) => !o)}
                >
                  답글
                </div>
              </div>
            </>
          ) : (
            <div>
              <CommentEdit
                reply={reply}
                onCommentSuccess={() => {
                  setIsEditing(false);
                  setOptionOn(false);
                }}
                onCancel={() => {
                  setIsEditing(false);
                  setOptionOn(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full mb-2">
        {inputOn ? (
          <CommentInput
            postId={reply.postId}
            target={reply.handle}
            targetId={parentId}
            onCommentSuccess={() => {
              setInputOn(false);
            }}
          />
        ) : null}
      </div>
    </>
  );
}
