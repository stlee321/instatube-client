import { ChangePwdForm } from "../types/req/ChangePwdForm";
import { LoginForm } from "../types/req/LoginForm";
import { SignInForm } from "../types/req/SignInForm";
import { SignOutForm } from "../types/req/SignOutForm";
import { ApiResponse } from "../types/res/BaseResponse";
import { LoginResponse } from "../types/res/LoginResponse";
import { RefreshResponse } from "../types/res/RefreshResponse";
import { baseUrl } from "./baseEnv";

export async function signIn(form: SignInForm): ApiResponse<string> {
  console.log("authFetch - signIn");
  const res = await fetch(baseUrl + "/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  console.log(`res status : ${res.status}`);
  const msg = await res.text();
  if (res.status === 200) {
    return {
      success: true,
      data: msg,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}, msg : ${msg}`,
  };
}

export async function signOut(
  accessToken: string,
  form: SignOutForm
): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/auth/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  const msg = await res.text();
  if (res.status === 200) {
    return {
      success: true,
      data: msg,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}, msg : ${msg}`,
  };
}

export async function isHandleUnique(
  handle: string,
  signal: AbortSignal | undefined
): ApiResponse<boolean> {
  const res = await fetch(baseUrl + "/api/auth/unique/handle?v=" + handle, {
    signal,
  });
  if (res.status === 200) {
    const result = await res.text();
    if (result === "true" || result === "false") {
      return {
        success: true,
        data: result === "true" ? true : false,
      };
    }
  }
  return {
    success: false,
    error: `status : ${res.status}`,
  };
}

export async function login(form: LoginForm): ApiResponse<LoginResponse> {
  const res = await fetch(baseUrl + "/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  const json = (await res.json()) as LoginResponse;
  if (res.status === 200) {
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}, msg : ${json.message}`,
  };
}

export async function logout(accessToken: string): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (res.status === 200) {
    return {
      success: true,
      data: "로그아웃 성공",
    };
  }
  return {
    success: false,
    error: `status : ${res.status}, 로그아웃 실패`,
  };
}

export async function changePassword(
  accessToken: string,
  form: ChangePwdForm
): ApiResponse<string> {
  const res = await fetch(baseUrl + "/api/auth/pwd/change", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify(form),
  });
  const msg = await res.text();
  if (res.status === 200) {
    return {
      success: true,
      data: msg,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}, msg : ${msg}`,
  };
}

export async function refresh(
  signal: AbortSignal | undefined
): ApiResponse<RefreshResponse> {
  const res = await fetch(baseUrl + "/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    signal,
  });
  const json = (await res.json()) as RefreshResponse;
  if (res.status === 200) {
    return {
      success: true,
      data: json,
    };
  }
  return {
    success: false,
    error: `status : ${res.status}, msg : ${json.message}`,
  };
}
