import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAppState } from "../appState/AppState";

export default function Settings() {
  const authState = useAppState((state) => state.authState);
  if (!authState.isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="w-full mt-24 md:mt-32 block md:flex justify-start items-start">
      <div className="w-full px-4 md:px-0 md:w-48 flex md:flex-col justify-between md:justify-center items-start">
        <div className="my-8">
          <NavLink
            to={"setme"}
            className={({ isActive }) => {
              return isActive ? "font-bold underline" : undefined;
            }}
          >
            아바타 변경
          </NavLink>
        </div>
        <div className="my-8">
          <NavLink
            to={"setpwd"}
            className={({ isActive }) => {
              return isActive ? "font-bold underline" : undefined;
            }}
          >
            비밀번호 변경
          </NavLink>
        </div>
        <div className="my-8">
          <NavLink
            to={"signout"}
            className={({ isActive }) => {
              return isActive ? "font-bold underline" : undefined;
            }}
          >
            회원 탈퇴
          </NavLink>
        </div>
      </div>
      <div className="w-full px-8 md:px-0 md:w-1/2">
        <Outlet />
      </div>
    </div>
  );
}
