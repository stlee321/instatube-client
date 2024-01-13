import { Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faImage } from "@fortawesome/free-solid-svg-icons";
import { useAppState } from "../appState/AppState";
import { useSignIn } from "../hook/useAuth";
import Button from "../component/common/Button";
import { useUploadAvatar } from "../hook/useImage";
import { isHandleUnique } from "../fetch/authFetch";
import { isValidHandle } from "../utils/validator";
import ButtonLoading from "../component/loading/ButtonLoading";

export default function SignIn() {
  const authState = useAppState((state) => state.authState);
  const [previewOn, setPreviewOn] = useState(false);
  const [signInInputState, setSignInInputState] = useState({
    handle: "",
    password: "",
    passwordCheck: "",
    avatarId: "",
  });
  const avatarInput = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();
  const signInMutation = useSignIn();
  const isLoading = uploadAvatarMutation.isLoading || signInMutation.isLoading;
  const navigate = useNavigate();
  const [handleUniqueState, setHandleUniqueState] = useState({
    isLoading: false,
    isUnique: false,
  });
  useEffect(() => {
    const abortController = new AbortController();
    async function _checkHandleUniqueness() {
      setHandleUniqueState((state) => ({ ...state, isLoading: true }));
      const result = await isHandleUnique(
        signInInputState.handle,
        abortController.signal
      );
      if (result.success) {
        setHandleUniqueState(() => ({
          isLoading: false,
          isUnique: result.data,
        }));
      }
    }
    const timer = setTimeout(() => {
      if (
        signInInputState.handle !== "" &&
        isValidHandle(signInInputState.handle)
      ) {
        _checkHandleUniqueness();
      }
    }, 400);
    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [signInInputState.handle]);
  if (authState.isLoggedIn) {
    return <Navigate to={"/"} />;
  }
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
        setPreviewOn(true);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <div className="w-full mt-32">
      <div className="text-xl font-bold mb-8 px-2 md:px-0">회원가입</div>
      <div className="block md:flex md:justify-start md:items-start">
        <div className="flex justify-center mb-8 md:mb-0 items-center md:block md:mr-8">
          <div>
            <label htmlFor="avatar-input">
              <div>
                <div className="relative w-32 h-32 flex justify-center items-center rounded-full bg-[#EDEDED] hover:cursor-pointer overflow-hidden">
                  <div className="text-[#A9A9A9]">
                    <FontAwesomeIcon icon={faImage} /> 아바타 설정
                  </div>
                  <img
                    id="avatar-preview"
                    src=""
                    alt=""
                    hidden={!previewOn}
                    className="z-10 absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </label>
            <input
              ref={avatarInput}
              id="avatar-input"
              type="file"
              accept="image/*"
              hidden
              onChange={setPreview}
            />
          </div>
        </div>
        <div className="w-full px-4">
          <div className="mb-8">
            <div className="font-semibold block">
              <div className="flex justify-start items-center">
                핸들
                <div className="ml-2 text-sm text-[#A9A9A9]">
                  (영어 대소문자, 숫자, 언더스코어 _ 15자 이하)
                </div>
              </div>
              <div className="h-4">
                {signInInputState.handle === "" ? (
                  <div></div>
                ) : !isValidHandle(signInInputState.handle) ? (
                  <div className="text-sm text-red-400">
                    {"형식에 맞는 핸들이 아닙니다."}
                  </div>
                ) : handleUniqueState.isLoading ? (
                  <div className="text-[#3EAEFF]">
                    <div className="w-fit animate-spin">
                      <FontAwesomeIcon icon={faCircleNotch} size={"sm"} />
                    </div>
                  </div>
                ) : handleUniqueState.isUnique ? (
                  <div className="text-sm text-green-400">
                    사용 가능한 핸들입니다.
                  </div>
                ) : (
                  <div className="text-sm text-red-400">
                    이미 존재하는 핸들입니다.
                  </div>
                )}
              </div>
            </div>
            <input
              className="w-full focus:outline-none py-2"
              value={signInInputState.handle}
              onChange={(e) => {
                setSignInInputState((state) => ({
                  ...state,
                  handle: e.target.value,
                }));
              }}
            />
            <div className="h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="mb-8">
            <div className="font-semibold">
              비밀번호
              {signInInputState.password !== "" &&
              signInInputState.password.length < 5 ? (
                <span className="ml-2 text-sm text-red-400">
                  비밀번호는 최소 5자 이상이어야 합니다.
                </span>
              ) : null}
            </div>
            <input
              type="password"
              className="w-full focus:outline-none py-2"
              value={signInInputState.password}
              onChange={(e) => {
                setSignInInputState((state) => ({
                  ...state,
                  password: e.target.value,
                }));
              }}
            />
            <div className="h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="mb-8">
            <div className="font-semibold">
              비밀번호 확인
              {signInInputState.passwordCheck !== "" &&
              signInInputState.password !== signInInputState.passwordCheck ? (
                <span className="ml-2 text-sm text-red-400">
                  비밀번호와 일치하지 않습니다.
                </span>
              ) : null}
            </div>
            <input
              type="password"
              className="w-full focus:outline-none py-2"
              value={signInInputState.passwordCheck}
              onChange={(e) => {
                setSignInInputState((state) => ({
                  ...state,
                  passwordCheck: e.target.value,
                }));
              }}
            />
            <div className="h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="flex justify-end items-center">
            <Button
              name="취소"
              buttonStyle="light"
              onClick={() => {
                navigate("/");
              }}
            />
            <div className="ml-2"></div>
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                name="가입"
                buttonStyle="solid"
                onClick={async () => {
                  if (authState.isLoggedIn) {
                    return;
                  }
                  if (!isValidHandle(signInInputState.handle)) {
                    alert("형식에 맞는 핸들이 아닙니다.");
                    return;
                  }
                  if (
                    signInInputState.handle === "me" ||
                    signInInputState.handle === "api"
                  ) {
                    alert("사용할 수 없는 핸들입니다.");
                    return;
                  }
                  if (signInInputState.password.length < 5) {
                    alert("비밀번호는 최소 5자 이상이어야 합니다.");
                    return;
                  }
                  if (
                    signInInputState.password !== signInInputState.passwordCheck
                  ) {
                    alert("비밀번호와 일치하지 않습니다");
                    return;
                  }
                  let res;
                  if (
                    avatarInput?.current?.files &&
                    avatarInput.current.files.length > 0
                  ) {
                    try {
                      res = await uploadAvatarMutation.mutateAsync({
                        avatar: avatarInput.current.files[0],
                      });
                    } catch (error) {
                      alert("다시 시도해 주세요");
                      return;
                    }
                  }
                  signInMutation.mutate(
                    {
                      form: {
                        handle: signInInputState.handle,
                        password: signInInputState.password,
                        avatarId: res?.resourceId || "",
                      },
                    },
                    {
                      onSuccess: () => {
                        navigate("/");
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
