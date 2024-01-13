import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppState } from "../appState/AppState";
import { useCreatePost } from "../hook/usePost";
import Button from "../component/common/Button";
import { useUploadImage } from "../hook/useImage";
import {
  post_content_max_length,
  post_title_max_length,
} from "../utils/constraint";
import ButtonLoading from "../component/loading/ButtonLoading";

export default function WritePost() {
  const authState = useAppState((state) => state.authState);
  const [previewOn, setPreviewOn] = useState(false);
  const [postInputState, setPostInputState] = useState({
    title: "",
    content: "",
  });
  const uploadImageMutation = useUploadImage();
  const createPostMutation = useCreatePost();
  const isLoading =
    uploadImageMutation.isLoading || createPostMutation.isLoading;
  const navigate = useNavigate();
  const imageInput = useRef<HTMLInputElement>(null);
  if (!authState.isLoggedIn) {
    return <Navigate to={"/"} replace={true} />;
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
        setPreviewOn(true);
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
                src=""
                alt=""
                hidden={!previewOn}
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
        <div className="w-full px-4">
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
                placeholder="@[핸들]로 링크 가능합니다. ex)@my_handle"
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
          <input name="imageId" hidden />
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
                name="포스트"
                buttonStyle="solid"
                onClick={async () => {
                  if (!authState.isLoggedIn) {
                    alert("로그인 하세요");
                    return;
                  }
                  if (
                    !(
                      imageInput?.current?.files &&
                      imageInput.current.files.length > 0
                    )
                  ) {
                    alert("이미지가 없습니다.");
                    return;
                  }
                  if (postInputState.title === "") {
                    alert("제목을 입력하세요");
                    return;
                  }
                  let res;
                  try {
                    res = await uploadImageMutation.mutateAsync({
                      accessToken: authState.accessToken,
                      image: imageInput.current.files[0],
                    });
                  } catch (error) {
                    alert("다시 시도해 주세요");
                    return;
                  }
                  createPostMutation.mutate(
                    {
                      accessToken: authState.accessToken,
                      form: {
                        title: postInputState.title,
                        content: postInputState.content,
                        imageId: res.resourceId,
                      },
                    },
                    {
                      onSuccess: (post) => {
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
        </div>
      </div>
    </div>
  );
}
