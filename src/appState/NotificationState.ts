import { create } from "zustand";

type NotificationState = {
  hasNotification: boolean;
  setHasNotification: (value: boolean) => void;
};

export const useNotificationState = create<NotificationState>((set) => {
  return {
    hasNotification: false,
    setHasNotification: (value) => {
      set(() => ({ hasNotification: value }));
    },
  };
});
