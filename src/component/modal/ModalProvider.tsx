import { useEffect, useState } from "react";
import { useAppState } from "../../appState/AppState";
import {
  Modal,
  ModalCloserContext,
  ModalController,
  ModalControllerContext,
} from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function ModalProvider({
  modals,
  children,
}: {
  modals: Modal[];
  children: React.ReactNode;
}) {
  const setModalContext = useAppState((state) => state.setModalContext);
  const [modalState, setModalState] = useState({
    currentKey: "",
    isOpen: false,
  });
  const { currentKey, isOpen } = modalState;
  const modalController = new ModalController(
    modals,
    setModalState,
    setModalContext
  );
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "scroll";
    return () => {
      document.body.style.overflow = "scroll";
    };
  });
  const _modalComponent = modalController.getElement(currentKey);
  return (
    <ModalControllerContext.Provider value={modalController}>
      <ModalCloserContext.Provider
        value={() => {
          setModalState((s) => ({ ...s, isOpen: false }));
        }}
      >
        {isOpen ? (
          <div
            className={
              "z-30 bg-slate-300/30 backdrop-blur-sm fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
            }
          >
            <div className="relative w-fit h-fit p-8 rounded-xl bg-white flex justify-center items-center">
              <div
                className="absolute top-2 right-2 hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalState((s) => ({ ...s, isOpen: false }));
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </div>
              {_modalComponent ? _modalComponent() : null}
            </div>
          </div>
        ) : null}
        {children}
      </ModalCloserContext.Provider>
    </ModalControllerContext.Provider>
  );
}
