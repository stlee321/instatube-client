import { useAppState } from "../../appState/AppState";
import Button from "../common/Button";
import { useAmIFollowing, useFollow } from "../../hook/useFollow";
import LightButtonLoading from "../loading/LightButtonLoading";
import ButtonLoading from "../loading/ButtonLoading";

export default function Follow({ handle }: { handle: string }) {
  const authState = useAppState((state) => state.authState);
  const isMe = authState.isLoggedIn && authState.handle === handle;
  const { data: isFollowing } = useAmIFollowing(
    authState.accessToken,
    authState.handle,
    handle,
    authState.isLoggedIn
  );
  const followMutation = useFollow();
  return isMe ? (
    <div></div>
  ) : (
    <div>
      {followMutation.isLoading ? (
        isFollowing ? (
          <LightButtonLoading />
        ) : (
          <ButtonLoading />
        )
      ) : (
        <Button
          name={isFollowing ? "팔로잉" : "팔로우"}
          buttonStyle={isFollowing ? "light" : "solid"}
          onClick={() => {
            if (!authState.isLoggedIn) {
              alert("로그인 하세요");
              return;
            }
            followMutation.mutate({
              accessToken: authState.accessToken,
              me: authState.handle,
              handle: handle,
              isFollowing: isFollowing || false,
            });
          }}
        />
      )}
    </div>
  );
}
