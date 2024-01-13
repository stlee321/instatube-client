import { useState } from "react";
import { useAppState } from "../appState/AppState";
import FollowingHome from "./FollowingHome";
import Home from "./Home";

export default function SelectableHome() {
  const authState = useAppState((state) => state.authState);
  const [showOnlyFollowings, setShowOnlyFollowings] = useState(false);
  return (
    <div className="w-full mt-28 md:mt-32 relative">
      {authState.isLoggedIn ? (
        <div className="px-2 lg:px-0 flex justify-end items-center md:mb-2 absolute right-0 -top-6 md:-top-8">
          <div className="flex justify-center items-center mr-2">
            <span className="text-sm text-[#2b2b2b]">팔로우만 보기</span>
          </div>
          <div
            className="flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              setShowOnlyFollowings((o) => !o);
            }}
          >
            <div
              className={
                "w-8 h-4 rounded-full border-2 " +
                (showOnlyFollowings
                  ? "bg-[#3EAEFF] border-[#3EAEFF]"
                  : "bg-[#A9A9A9] border-[#A9A9A9]")
              }
            >
              <div
                className={
                  "transition duration-100 ease-linear rounded-full aspect-square h-full bg-[#EDEDED] " +
                  (showOnlyFollowings ? "translate-x-4" : "")
                }
              ></div>
            </div>
          </div>
        </div>
      ) : null}
      {showOnlyFollowings ? <FollowingHome /> : <Home />}
    </div>
  );
}
