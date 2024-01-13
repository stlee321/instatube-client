import { Navigate } from "react-router-dom";
import { useAppState } from "../../appState/AppState";
import { useState } from "react";
import Button from "../common/Button";
import { useChangePassword } from "../../hook/useAuth";
import ButtonLoading from "../loading/ButtonLoading";

export default function SetPwd() {
  const authState = useAppState((state) => state.authState);
  const [formState, setFormState] = useState({
    currentPwd: "",
    newPwd: "",
    newPwdCheck: "",
  });
  function resetForm() {
    setFormState({ currentPwd: "", newPwd: "", newPwdCheck: "" });
  }
  const changePasswordMutation = useChangePassword();
  if (!authState.isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <div>
        <div className="w-full mb-8">
          <div className="font-semibold">현재 비밀번호</div>
          <input
            type="password"
            className="w-full p-2 focus:outline-none"
            name="currentPwd"
            value={formState.currentPwd}
            onChange={(e) => {
              setFormState((state) => ({
                ...state,
                currentPwd: e.target.value,
              }));
            }}
          />
          <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
        </div>
        <div className="w-full mb-8">
          <div className="font-semibold">새 비밀번호</div>
          <input
            type="password"
            className="w-full p-2 focus:outline-none"
            name="newPwd"
            value={formState.newPwd}
            onChange={(e) => {
              setFormState((state) => ({
                ...state,
                newPwd: e.target.value,
              }));
            }}
          />
          <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
        </div>
        <div className="w-full mb-8">
          <div className="font-semibold">
            새 비밀번호 확인
            {formState.newPwdCheck !== "" &&
            formState.newPwd !== formState.newPwdCheck ? (
              <span className="ml-2 text-sm text-red-400">
                새 비밀번호와 일치하지 않습니다.
              </span>
            ) : null}
          </div>
          <input
            type="password"
            className="w-full p-2 focus:outline-none"
            name="newPwdCheck"
            value={formState.newPwdCheck}
            onChange={(e) => {
              setFormState((state) => ({
                ...state,
                newPwdCheck: e.target.value,
              }));
            }}
          />
          <div className="w-full h-[2px] rounded-full bg-[#A9A9A9]"></div>
        </div>
        <div className="w-full flex justify-end items-center">
          {changePasswordMutation.isLoading ? (
            <ButtonLoading />
          ) : (
            <Button
              name="저장"
              buttonStyle="solid"
              onClick={() => {
                changePasswordMutation.mutate(
                  {
                    accessToken: authState.accessToken,
                    form: {
                      currentPwd: formState.currentPwd,
                      newPwd: formState.newPwd,
                    },
                  },
                  {
                    onSuccess: () => {
                      resetForm();
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
  );
}
