import { useModal } from "./Modal";
import { useAppState } from "../../appState/AppState";
import { useLogin } from "../../hook/useAuth";
import Button from "../common/Button";
import { useState } from "react";
import { getMe } from "../../fetch/userFetch";
import ButtonLoading from "../loading/ButtonLoading";

type LoginInputState = {
  handle: string;
  password: string;
};

export default function LoginModal() {
  const { setAuthState } = useAppState((state) => ({
    setAuthState: state.setAuthState,
  }));
  const loginModal = useModal("login");
  const loginMutation = useLogin();
  const [loginInputState, setLoginInputState] = useState<LoginInputState>({
    handle: "",
    password: "",
  });
  return (
    <div className="w-64 flex flex-col justify-start items-center">
      <div className="text-xl font-bold">로그인</div>
      <div>
        <div>
          <div className="mb-4">
            <div className="font-semibold">핸들</div>
            <input
              className="py-2 focus:outline-none"
              value={loginInputState.handle}
              onChange={(e) => {
                setLoginInputState((state) => ({
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
              value={loginInputState.password}
              onChange={(e) => {
                setLoginInputState((state) => ({
                  ...state,
                  password: e.target.value,
                }));
              }}
            />
            <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
          </div>
          <div className="flex justify-end items-center">
            {loginMutation.isLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                name="로그인"
                buttonStyle="solid"
                onClick={() => {
                  loginMutation.mutate(
                    {
                      form: loginInputState,
                    },
                    {
                      onSuccess: async (data) => {
                        if (data.accessToken === "") {
                          alert("로그인 실패");
                          loginModal.close();
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
                        loginModal.close();
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
      </div>
    </div>
  );
}
