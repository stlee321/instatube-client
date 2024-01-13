import { useAppState } from "../../appState/AppState";
import FollowModalItem from "./FollowModalItem";
import React, { useEffect, useState } from "react";
import { useFollowers, useFollowings } from "../../hook/useFollow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

type FollowTab = "follower" | "following";
export default function FollowModal() {
  const [currentTab, setCurrentTab] = useState("follower");
  const { tab, handle } = useAppState((state) => state.modalContext) as {
    tab: FollowTab;
    handle: string;
  };
  useEffect(() => {
    setCurrentTab(tab);
  }, [tab]);
  const { data: followers, isLoading: isFollowersLoading } =
    useFollowers(handle);
  const { data: followings, isLoading: isFollowingsLoading } =
    useFollowings(handle);
  return (
    <div className="w-64 h-96">
      <div className="flex justify-center items-center">
        <div
          className="w-1/2 flex justify-center items-center py-2 select-none hover:cursor-pointer"
          onClick={() => {
            setCurrentTab("follower");
          }}
        >
          팔로워
        </div>
        <div
          className="w-1/2 flex justify-center items-center py-2 select-none hover:cursor-pointer"
          onClick={() => {
            setCurrentTab("following");
          }}
        >
          팔로잉
        </div>
      </div>
      <div className="flex justify-center items-center">
        {currentTab === "follower" ? (
          <div className="w-1/2 h-[2px] rounded-full bg-[#A9A9A9]"></div>
        ) : (
          <div className="w-1/2 h-[2px] rounded-full bg-[#EDEDED]"></div>
        )}
        {currentTab === "following" ? (
          <div className="w-1/2 h-[2px] rounded-full bg-[#A9A9A9]"></div>
        ) : (
          <div className="w-1/2 h-[2px] rounded-full bg-[#EDEDED]"></div>
        )}
      </div>
      <div className="w-full h-full overflow-y-auto">
        {currentTab === "follower"
          ? followers?.pages.map((page, i) => {
              if (!page || page.followers.length === 0) return null;
              return (
                <React.Fragment key={"follower_page_" + i}>
                  {page.followers.map((follower) => {
                    return (
                      <FollowModalItem
                        key={"from_" + follower}
                        handle={follower}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })
          : currentTab === "following"
          ? followings?.pages.map((page, i) => {
              if (!page || page.followings.length === 0) return null;
              return (
                <React.Fragment key={"following_page_" + i}>
                  {page.followings.map((following) => {
                    return (
                      <FollowModalItem
                        key={"to_" + following}
                        handle={following}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })
          : null}
        {isFollowersLoading || isFollowingsLoading ? (
          <div className="w-full flex justify-center items-start">
            <div className="animate-spin">
              <FontAwesomeIcon
                icon={faCircleNotch}
                size={"sm"}
                color={"#3EAEFF"}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
