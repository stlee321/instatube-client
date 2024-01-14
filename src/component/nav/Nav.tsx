import {Link, useNavigate} from "react-router-dom";
// import SearchBar from "./SearchBar";
import Button from "../common/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEllipsis,
  faGear,
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {faBell} from "@fortawesome/free-regular-svg-icons";
import {useModal} from "../modal/Modal";
import {initAuthState, useAppState} from "../../appState/AppState";
import {useState} from "react";
import {useLogout} from "../../hook/useAuth";
import {useMe} from "../../hook/useUser";
import {useAvatarImage} from "../../hook/useImage";
import {useQueryClient} from "@tanstack/react-query";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import NavDrawer from "./NavDrawer";
import {useNotificationState} from "../../appState/NotificationState";

export default function Nav() {
  const {authState, setAuthState} = useAppState((state) => ({
    authState: state.authState,
    setAuthState: state.setAuthState,
  }));
  const {data: me} = useMe(authState.accessToken, authState.isLoggedIn);
  const {data: avatarUrl} = useAvatarImage(me?.avatarId || "", !!me);
  const loginModal = useModal("login");
  const notiModal = useModal("notification");
  const navigate = useNavigate();
  const [optionOn, setOptionOn] = useState(false);
  const [drawerOn, setDrawerOn] = useState(false);
  const logoutMutation = useLogout();
  const {hasNotification, setHasNotification} = useNotificationState(
    (state) => ({
      hasNotification: state.hasNotification,
      setHasNotification: state.setHasNotification,
    })
  );
  const queryClient = useQueryClient();
  const onCloseDrawer = () => {
    setDrawerOn(false);
  };
  return (
    <div className="w-full px-2 lg:px-32 flex justify-between items-center h-20 fixed top-0 left-0 z-20 bg-white">
      <div className="flex justify-start items-center md:hidden">
        <div className="mr-2">
          <div
            className="aspect-square h-8 hover:cursor-pointer"
            onClick={() => {
              setDrawerOn((o) => !o);
            }}
          >
            <div className="flex justify-center items-center w-full h-full rounded-full">
              <FontAwesomeIcon icon={faBars} size={"lg"} />
            </div>
          </div>
          <Drawer
            open={drawerOn}
            onClose={onCloseDrawer}
            direction="left"
            className="px-8"
          >
            <NavDrawer onClose={onCloseDrawer} />
          </Drawer>
        </div>
        <div>
          <Link to={"/"}>
            <div className="text-3xl select-none">INSTATUBE</div>
          </Link>
        </div>
      </div>
      <div className="hidden md:block">
        <Link to={"/"}>
          <div className="text-3xl select-none">INSTATUBE</div>
        </Link>
      </div>
      <div className="flex justify-end items-center">
        <div className="md:hidden">
          <div className="w-8 h-8 flex justify-center items-center rounded-full hover:cursor-pointer">
            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
          </div>
        </div>
        <div className="md:hidden relative">
          {authState.isLoggedIn ? (
            <div
              onClick={() => {
                setHasNotification(false);
                notiModal.open();
              }}
              className="w-8 h-8 flex justify-center items-center rounded-full hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faBell} size="lg" />
              {hasNotification ? (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-[1px] border-white">
                  <div className="w-full h-full bg-red-500 animate-ping rounded-full"></div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {/* <div className="hidden md:block">
        <SearchBar />
      </div> */}
      {authState.isLoggedIn ? (
        <div className="hidden md:flex jusitfy-end items-center">
          <div className="w-12 h-12 relative rounded-full overflow-hidden">
            <Link to={"/u/" + authState.handle}>
              <div className="w-12 h-12 rounded-full bg-[#EDEDED] hover:cursor-pointer"></div>
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={avatarUrl || ""}
                alt=""
                hidden={!avatarUrl}
              />
            </Link>
          </div>
          <div className="w-2"></div>
          <div
            onClick={() => {
              setHasNotification(false);
              notiModal.open();
            }}
            className="w-12 h-12 flex justify-center items-center bg-[#EDEDED] rounded-full hover:cursor-pointer relative"
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
            {hasNotification ? (
              <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-[2px] border-white">
                <div className="w-full h-full bg-red-500 animate-ping rounded-full"></div>
              </div>
            ) : null}
          </div>
          <div className="w-2"></div>
          <Button
            name="글쓰기"
            buttonStyle="solid"
            onClick={() => {
              navigate("/post");
            }}
          />
          <div className="w-2"></div>
          <div className="relative">
            <div
              onClick={() => {
                setOptionOn((o) => !o);
              }}
              className="w-12 h-12 flex justify-center items-center bg-[#EDEDED] rounded-full hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faEllipsis} size="lg" />
            </div>
            {optionOn ? (
              <div className="absolute right-0 w-32 bg-white rounded-lg border-[1px] border-[#A9A9A9] overflow-hidden">
                <div
                  className="py-2 px-2 hover:cursor-pointer hover:bg-[#EDEDED]"
                  onClick={() => {
                    setOptionOn(false);
                    navigate("/settings");
                  }}
                >
                  <FontAwesomeIcon icon={faGear} /> 설정
                </div>
                <div
                  className="py-2 px-2 hover:cursor-pointer hover:bg-[#EDEDED]"
                  onClick={() => {
                    logoutMutation.mutate(
                      {
                        accessToken: authState.accessToken,
                      },
                      {
                        onSuccess: () => {
                          queryClient.clear();
                          setAuthState(initAuthState);
                          setOptionOn(false);
                        },
                      }
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex justify-end items-center">
          <Button
            name="로그인"
            buttonStyle="solid"
            onClick={() => {
              loginModal.open();
            }}
          />
          <div className="w-2"></div>
          <Button
            name="회원가입"
            buttonStyle="light"
            onClick={() => {
              navigate("/signin");
            }}
          />
        </div>
      )}
    </div>
  );
}
