import { Navigate } from "react-router-dom";
import { initAuthState, useAppState } from "../../appState/AppState";
import { useState } from "react";
import { useSignOut } from "../../hook/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";

export default function SignOut() {
  const { authState, setAuthState } = useAppState((state) => ({
    authState: state.authState,
    setAuthState: state.setAuthState,
  }));
  const [password, setPassword] = useState("");
  const signOutMutation = useSignOut();
  const queryClient = useQueryClient();
  if (!authState.isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <div className="flex flex-col justify-start items-center font-bold text-xl my-8">
        <div>회원 탈퇴 후 되돌릴 수 없습니다.</div>
        <div>모든 포스트, 댓글이 삭제됩니다.</div>
      </div>
      <div>
        <div className="mb-8">
          <div className="font-semibold">비밀번호</div>
          <input
            type="password"
            className="w-full p-2 focus:outline-none"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
        </div>
        <div className="flex justify-end items-center">
          {signOutMutation.isLoading ? (
            <div
              className={"rounded-full px-4 border-2 bg-red-500 border-red-500"}
            >
              <div className="animate-spin">
                <FontAwesomeIcon icon={faCircleNotch} color={"#FFFFFF"} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="px-4 bg-red-500 text-white rounded-full"
              onClick={() => {
                if (password === "") {
                  alert("비밀번호를 입력하세요");
                  return;
                }
                signOutMutation.mutate(
                  {
                    accessToken: authState.accessToken,
                    form: {
                      handle: authState.handle,
                      password: password,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.clear();
                      setAuthState(initAuthState);
                    },
                    onError: () => {
                      alert("다시 시도해 보세요");
                    },
                  }
                );
              }}
            >
              탈퇴하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
