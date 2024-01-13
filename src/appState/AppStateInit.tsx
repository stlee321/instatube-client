import { useEffect } from "react";
import { useRefresh } from "../hook/useAuth";
import { useMe } from "../hook/useUser";
import { useAppState } from "./AppState";

export default function AppStateInit() {
  const { authState, setAuthState } = useAppState((state) => ({
    authState: state.authState,
    setAuthState: state.setAuthState,
  }));
  const {
    data: refresh,
    isLoading: isRefreshLoading,
    isError: isRefreshError,
  } = useRefresh();
  const { data: me } = useMe(
    refresh?.accessToken || "",
    !isRefreshLoading && !isRefreshError && refresh !== null
  );
  useEffect(() => {
    if (!authState.isLoggedIn && !!refresh && !!me) {
      setAuthState({
        handle: me.handle,
        avatarId: me.avatarId,
        accessToken: refresh.accessToken,
        isLoggedIn: true,
      });
    }
  });
  return null;
}
