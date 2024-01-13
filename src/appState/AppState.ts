import { create } from "zustand";

type AuthState = {
  handle: string;
  avatarId: string;
  accessToken: string;
  isLoggedIn: boolean;
};

export const initAuthState: AuthState = {
  handle: "",
  avatarId: "",
  accessToken: "",
  isLoggedIn: false,
};

type AppState = {
  authState: AuthState;
  modalContext: unknown;
  setModalContext: (newModalContext: unknown) => void;
  setAuthState: (authState: AuthState) => void;
};

export const useAppState = create<AppState>((set) => {
  return {
    authState: initAuthState,
    modalContext: {},
    setModalContext: (newModalContext: unknown) => {
      set(() => ({
        modalContext: newModalContext,
      }));
    },
    setAuthState: (authState) => {
      set(() => ({ authState: authState }));
    },
  };
});
