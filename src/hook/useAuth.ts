import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePassword,
  isHandleUnique,
  login,
  logout,
  refresh,
  signIn,
  signOut,
} from "../fetch/authFetch";
import { SignInForm } from "../types/req/SignInForm";
import { SignOutForm } from "../types/req/SignOutForm";
import { LoginForm } from "../types/req/LoginForm";
import { LoginResponse } from "../types/res/LoginResponse";
import { ChangePwdForm } from "../types/req/ChangePwdForm";

export function useRefresh() {
  return useQuery({
    queryKey: ["refresh"],
    queryFn: async ({ signal }) => {
      const result = await refresh(signal);
      return result.success ? result.data : null;
    },
  });
}

export function useIsHandleUnique(handle: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["handleUnique"],
    queryFn: async ({ signal }) => {
      const result = await isHandleUnique(handle, signal);
      return result.success ? result.data : false;
    },
    enabled: enabled,
  });
}

type SignInProps = {
  form: SignInForm;
};

export function useSignIn() {
  return useMutation<string, Error, SignInProps>({
    mutationFn: async ({ form }) => {
      const result = await signIn(form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
}

type SignOutProps = {
  accessToken: string;
  form: SignOutForm;
};

export function useSignOut() {
  return useMutation<string, Error, SignOutProps>({
    mutationFn: async ({ accessToken, form }) => {
      const result = await signOut(accessToken, form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
}

type LoginProps = {
  form: LoginForm;
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginProps>({
    mutationFn: async ({ form }) => {
      const result = await login(form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
}

type LogoutProps = {
  accessToken: string;
};

export function useLogout() {
  return useMutation<string, Error, LogoutProps>({
    mutationFn: async ({ accessToken }) => {
      const result = await logout(accessToken);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
}

type ChangePasswordProps = {
  accessToken: string;
  form: ChangePwdForm;
};

export function useChangePassword() {
  return useMutation<string, Error, ChangePasswordProps>({
    mutationFn: async ({ accessToken, form }) => {
      const result = await changePassword(accessToken, form);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
}
