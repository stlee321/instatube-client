import { useState } from "react";
import { initAuthState, useAppState } from "../../appState/AppState";
import Button from "../common/Button";
import { useLogin, useLogout } from "../../hook/useAuth";
import ButtonLoading from "../loading/ButtonLoading";
import { getMe } from "../../fetch/userFetch";
import { useMe } from "../../hook/useUser";
import { useAvatarImage } from "../../hook/useImage";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";

type LoginInputState = {
  handle: string;
  password: string;
};

type NavDrawerProps = {
  onClose: () => void;
};

export default function NavDrawer({ onClose }: NavDrawerProps) {
  const { authState, setAuthState } = useAppState((state) => ({
    authState: state.authState,
    setAuthState: state.setAuthState,
  }));
  const [mobileLoginOn, setMobileLoginOn] = useState(false);
  const [mobileLoginInputState, setMobileLoginInputState] =
    useState<LoginInputState>({
      handle: "",
      password: "",
    });
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const { data: me } = useMe(authState.accessToken, authState.isLoggedIn);
  const { data: avatarUrl } = useAvatarImage(me?.avatarId || "", !!me);
  const navigate = useNavigate();
  return (
    <>
      <div className="text-3xl my-8">INSTATUBE</div>
      {authState.isLoggedIn ? (
        <div>
          <div className="mb-32">
            <div className="mb-8 flex justify-between items-center">
              <div className="flex justify-start items-center">
                <div
                  className="w-12 h-12 relative rounded-full overflow-hidden mr-4"
                  onClick={() => {
                    onClose();
                    navigate("/u/" + authState.handle);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#EDEDED] hover:cursor-pointer"></div>
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={avatarUrl || ""}
                    alt=""
                    hidden={!avatarUrl}
                  />
                </div>
                <div
                  className="font-semibold"
                  onClick={() => {
                    onClose();
                    navigate("/u/" + authState.handle);
                  }}
                >
                  @{authState.handle}
                </div>
              </div>
              <div
                onClick={() => {
                  onClose();
                  navigate("/settings");
                }}
              >
                <FontAwesomeIcon icon={faGear} size={"sm"} />
              </div>
            </div>
            <div>
              <div
                onClick={() => {
                  onClose();
                  navigate("/post");
                }}
                className="bg-[#3EAEFF] text-white font-semibold flex justify-center items-center py-2 rounded-full"
              >
                글쓰기
              </div>
            </div>
          </div>
          <div>
            <div>
              <div
                onClick={() => {
                  logoutMutation.mutate(
                    {
                      accessToken: authState.accessToken,
                    },
                    {
                      onSuccess: () => {
                        queryClient.clear();
                        setAuthState(initAuthState);
                        onClose();
                      },
                    }
                  );
                }}
                className="border-2 border-[#EDEDED] bg-[#EDEDED] flex justify-center items-center rounded-full"
              >
                로그아웃
              </div>
            </div>
          </div>
        </div>
      ) : mobileLoginOn ? (
        <div>
          <div className="mb-4">
            <div className="font-semibold">핸들</div>
            <input
              className="py-2 focus:outline-none"
              value={mobileLoginInputState.handle}
              onChange={(e) => {
                setMobileLoginInputState((state) => ({
                  ...state,
                  handle: e.target.value,
                }));
              }}
            />
            <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="mb-4">
            <div className="font-semibold">비밀번호</div>
            <input
              type="password"
              className="py-2 focus:outline-none"
              value={mobileLoginInputState.password}
              onChange={(e) => {
                setMobileLoginInputState((state) => ({
                  ...state,
                  password: e.target.value,
                }));
              }}
            />
            <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="flex justify-between items-center">
            <Button
              name="취소"
              buttonStyle="light"
              onClick={() => {
                setMobileLoginOn(false);
              }}
            />
            {loginMutation.isLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                name="로그인"
                buttonStyle="solid"
                onClick={() => {
                  loginMutation.mutate(
                    {
                      form: mobileLoginInputState,
                    },
                    {
                      onSuccess: async (data) => {
                        if (data.accessToken === "") {
                          alert("로그인 실패");
                          return;
                        }
                        const res = await getMe(data.accessToken, undefined);
                        if (res.success) {
                          setAuthState({
                            handle: res.data.handle,
                            accessToken: data.accessToken,
                            avatarId: res.data.avatarId,
                            isLoggedIn: true,
                          });
                        } else {
                          alert("다시 시도해 보세요");
                        }
                        onClose();
                        setMobileLoginOn(false);
                        setMobileLoginInputState({ handle: "", password: "" });
                      },
                      onError: () => {
                        alert("다시 시도해 보세요");
                      },
                    }
                  );
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="my-4">
            <Button
              name="로그인"
              buttonStyle="solid"
              onClick={() => {
                setMobileLoginOn(true);
              }}
            />
          </div>
          <div className="my-4">
            <Button
              name="회원가입"
              buttonStyle="light"
              onClick={() => {
                onClose();
                navigate("/signin");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
