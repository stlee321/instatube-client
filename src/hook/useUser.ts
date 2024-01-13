import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getUser, setMe } from "../fetch/userFetch";
import { SetMeForm } from "../types/req/SetMeForm";
import { UserInfoResponse } from "../types/res/UserInfoResponse";

export function getMeKey() {
  return ["me"];
}

export function useMe(accessToken: string, enabled: boolean) {
  return useQuery({
    queryKey: getMeKey(),
    queryFn: async ({ signal }) => {
      const result = await getMe(accessToken, signal);
      if (result.success) {
        return result.data;
      }
      return null;
    },
    enabled: enabled,
  });
}

export function getUserKey(handle: string) {
  return ["user", handle];
}

export function useUser(handle: string, enabled: boolean = true) {
  return useQuery({
    queryKey: getUserKey(handle),
    queryFn: async ({ signal }) => {
      const result = await getUser(handle, signal);
      if (result.success) {
        return result.data;
      }
      return null;
    },
    enabled: enabled,
  });
}

type SetMeProps = {
  accessToken: string;
  form: SetMeForm;
};

export function useSetMe() {
  const queryClient = useQueryClient();
  return useMutation<UserInfoResponse, Error, SetMeProps>({
    mutationFn: async ({ accessToken, form }) => {
      const result = await setMe(accessToken, form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getMeKey() });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
