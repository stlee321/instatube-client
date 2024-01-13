import { Outlet } from "react-router-dom";
import Nav from "./component/nav/Nav";
import { Modal } from "./component/modal/Modal";
import LoginModal from "./component/modal/LoginModal";
import FollowModal from "./component/modal/FollowModal";
import AppStateInit from "./appState/AppStateInit";
import { ModalProvider } from "./component/modal/ModalProvider";
import NotificationModal from "./component/modal/NotificationModal";
import NotificationStateInit from "./appState/NotificationStateInit";

const modals: Modal[] = [
  {
    key: "login",
    modalElement: () => <LoginModal />,
  },
  {
    key: "follow",
    modalElement: () => <FollowModal />,
  },
  {
    key: "notification",
    modalElement: () => <NotificationModal />,
  },
];

export default function Layout() {
  document.title = "INSTATUBE";
  return (
    <>
      <AppStateInit />
      <NotificationStateInit />
      <ModalProvider modals={modals}>
        <div className="pb-32 bg-white flex flex-col justify-start items-center">
          <div className="w-full lg:w-1/2">
            <Nav />
            <Outlet />
          </div>
        </div>
      </ModalProvider>
    </>
  );
}
