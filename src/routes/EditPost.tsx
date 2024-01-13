import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Form, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../appState/AppState";
import { usePost, useUpdatePost } from "../hook/usePost";
import { usePostImage, useUploadImage } from "../hook/useImage";
import Button from "../component/common/Button";
import {
  post_content_max_length,
  post_title_max_length,
} from "../utils/constraint";
import ButtonLoading from "../component/loading/ButtonLoading";

export default function EditPost() {
  const authState = useAppState((state) => state.authState);
  const { postId } = useParams();
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = usePost(postId || "", postId !== undefined);
  const { data: imageUrl } = usePostImage(post?.imageId || "", !!post);
  const [postInputState, setPostInputState] = useState({
    title: post?.title || "",
    content: post?.content || "",
  });
  const uploadImageMutation = useUploadImage();
  const updatePostMutation = useUpdatePost();
  const isLoading =
    uploadImageMutation.isLoading || updatePostMutation.isLoading;
  const navigate = useNavigate();
  const imageInput = useRef<HTMLInputElement>(null);
  if (postId === undefined) {
    return <Navigate to={"/"} replace={true} />;
  }
  if (isPostLoading) {
    return <div>로딩중</div>;
  }
  if (isPostError) {
    return <div>포스트 로드중 오류. 새로고침 하세요</div>;
  }
  if (post === null) {
    alert("없는 포스트 입니다.");
    return <Navigate to={"/"} replace={true} />;
  }
  if (!authState.isLoggedIn) {
    return <Navigate to={"/p/" + post.postId} replace={true} />;
  }
  if (post.handle !== authState.handle) {
    return <Navigate to={"/p/" + post.postId} replace={true} />;
  }
  const setPreview: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const postImage = document.getElementById(
          "image-preview"
        ) as HTMLImageElement;
        if (postImage === undefined) return;
        if (e.target === null) return;
        if (e.target.result === null) return;
        if (e.target.result instanceof ArrayBuffer) return;
        postImage.src = e.target.result;
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <div className="w-full mt-32">
      <div className="block md:flex justify-between items-start">
        <div className="aspect-square w-full md:w-96 mb-8 md:mb-0">
          <label htmlFor="image-input">
            <div className="relative bg-[#EDEDED] hover:cursor-pointer w-full h-full flex justify-center items-center text-[#A9A9A9] select-none">
              <FontAwesomeIcon icon={faImage} /> 이미지 업로드
              <img
                id="image-preview"
                src={imageUrl || ""}
                alt=""
                className="w-full h-full object-cover absolute top-0 left-0 z-10"
              />
            </div>
          </label>
          <input
            ref={imageInput}
            id="image-input"
            type="file"
            hidden
            accept="image/*"
            onChange={setPreview}
          />
        </div>
        <Form className="w-full px-4" action="/post">
          <div className="mb-8">
            <div className="font-semibold">제목</div>
            <input
              name="title"
              className="w-full focus:outline-none py-2"
              value={postInputState.title}
              onChange={(e) => {
                if (e.target.value.length > post_title_max_length) return;
                setPostInputState((state) => ({
                  ...state,
                  title: e.target.value,
                }));
              }}
            />
            <div className="h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="mb-8">
            <div className="font-semibold">내용</div>
            <div className="relative">
              <textarea
                name="content"
                className="w-full p-2 rounded-lg border-2 border-[#A9A9A9] focus:outline-none resize-none h-64"
                value={postInputState.content}
                onChange={(e) => {
                  if (e.target.value.length > post_content_max_length) return;
                  setPostInputState((state) => ({
                    ...state,
                    content: e.target.value,
                  }));
                }}
              />
              <div className="absolute right-2 bottom-2 text-[#A9A9A9]">
                {postInputState.content.length}/{post_content_max_length}
              </div>
            </div>
          </div>
          <input name="imageId" defaultValue={post.imageId} hidden />
          <div className="flex justify-end items-center">
            <Button
              name="취소"
              buttonStyle="light"
              onClick={() => {
                navigate(-1);
              }}
            />
            <div className="ml-2"></div>
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                name="수정"
                buttonStyle="solid"
                onClick={async () => {
                  if (!authState.isLoggedIn) {
                    alert("로그인 하세요");
                    return;
                  }
                  let res;
                  if (
                    imageInput?.current?.files &&
                    imageInput.current.files.length > 0
                  ) {
                    try {
                      res = await uploadImageMutation.mutateAsync({
                        accessToken: authState.accessToken,
                        image: imageInput.current.files[0],
                      });
                    } catch (error) {
                      alert("다시 시도해 주세요");
                      return;
                    }
                  }
                  updatePostMutation.mutate(
                    {
                      accessToken: authState.accessToken,
                      postId: postId,
                      form: {
                        title: postInputState.title,
                        content: postInputState.content,
                        imageId: res?.resourceId || post.imageId,
                      },
                    },
                    {
                      onSuccess: () => {
                        navigate("/p/" + post.postId);
                      },
                      onError: () => {
                        alert("다시 시도해 주세요");
                      },
                    }
                  );
                }}
              />
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
