import React, { useRef } from "react";
import { useAppState } from "../../appState/AppState";
import { useAvatarImage, useUpdateMyAvatar } from "../../hook/useImage";
import { getMeKey, useMe, useSetMe } from "../../hook/useUser";
import Button from "../common/Button";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import ButtonLoading from "../loading/ButtonLoading";

export default function SetMe() {
  const authState = useAppState((state) => state.authState);
  const { data: me, isLoading: isMeLoading } = useMe(
    authState.accessToken,
    authState.isLoggedIn
  );
  const { data: imageUrl } = useAvatarImage(me?.avatarId || "", me !== null);
  const updateAvatarMutation = useUpdateMyAvatar();
  const setMeMutation = useSetMe();
  const isLoading = updateAvatarMutation.isLoading || setMeMutation.isLoading;
  const avatarInput = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const setPreview: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const avatarImage = document.getElementById(
          "avatar-preview"
        ) as HTMLImageElement;
        if (avatarImage === undefined) return;
        if (e.target === null) return;
        if (e.target.result === null) return;
        if (e.target.result instanceof ArrayBuffer) return;
        avatarImage.src = e.target.result;
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isMeLoading) {
    return (
      <div className="w-full flex justify-center items-start">
        <FontAwesomeIcon
          className="animate-spin"
          icon={faCircleNotch}
          size={"xl"}
        />
      </div>
    );
  }

  if (!me) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-end mb-8">
        <div>
          <div className="relative w-48 h-48 rounded-full overflow-hidden bg-[#EDEDED]">
            <img
              id="avatar-preview"
              src={imageUrl}
              alt=""
              hidden={imageUrl === undefined}
              className="w-full h-full object-cover absolute top-0 left-0 z-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="avatar-input">
            <div className="px-4 rounded-full bg-[#3EAEFF] text-white hover:cursor-pointer whitespace-nowrap">
              이미지 변경
            </div>
          </label>
          <input
            ref={avatarInput}
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={setPreview}
            hidden
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-end items-center">
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button
              name="저장"
              buttonStyle="solid"
              onClick={async () => {
                if (!authState.isLoggedIn) {
                  return;
                }
                let imageRes;
                if (
                  avatarInput?.current?.files &&
                  avatarInput.current.files.length > 0
                ) {
                  try {
                    imageRes = await updateAvatarMutation.mutateAsync({
                      accessToken: authState.accessToken,
                      avatar: avatarInput.current.files[0],
                    });
                  } catch (error) {
                    alert("이미지 업로드 실패. 다시 시도해 주세요");
                    return;
                  }
                }
                setMeMutation.mutate(
                  {
                    accessToken: authState.accessToken,
                    form: {
                      avatarId: imageRes?.resourceId || me.avatarId,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({ queryKey: getMeKey() });
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
