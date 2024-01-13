import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from "react";

export type Modal = {
  key: string;
  modalElement: () => React.ReactNode;
};

export type ModalState = {
  currentKey: string;
  isOpen: boolean;
};

export class ModalController {
  modals: Modal[] = [];
  _setModalState: Dispatch<SetStateAction<ModalState>>;
  _setModalContext: (newModalContext: unknown) => void;
  constructor(
    modals: Modal[],
    setModalState: Dispatch<SetStateAction<ModalState>>,
    _setModalContext: (newModalContext: unknown) => void
  ) {
    this.modals = modals;
    this._setModalState = setModalState;
    this._setModalContext = _setModalContext;
  }
  setModalState(modalState: ModalState) {
    this._setModalState(() => modalState);
  }
  setContext(context: unknown) {
    this._setModalContext(context);
  }
  getElement(key: string) {
    if (this.modals.length === 0) return null;
    const elem = this.modals.find((m) => m.key === key);
    if (elem === undefined) return null;
    return elem.modalElement;
  }
}

export const ModalControllerContext = createContext<
  ModalController | undefined
>(undefined);

export const ModalCloserContext = createContext<() => void>(() => {});

export function useModalCloser() {
  return useContext(ModalCloserContext);
}

export function useModal(modalKey: string) {
  const modalController = useContext(ModalControllerContext);
  return {
    open(context?: unknown) {
      if (context !== undefined) {
        modalController?.setContext(context);
      }
      modalController?.setModalState({ currentKey: modalKey, isOpen: true });
    },
    close() {
      modalController?.setContext({});
      modalController?.setModalState({ currentKey: "", isOpen: false });
    },
  };
}
