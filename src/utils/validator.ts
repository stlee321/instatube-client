import {
  handle_max_length,
  password_min_length,
  post_content_max_length,
  post_title_max_length,
  reply_max_length,
} from "../utils/constraint";

export function isValidHandle(handle: string): boolean {
  if (handle === "") return false;
  if (handle.length > handle_max_length) return false;
  if (handle === "me") return false;
  if (handle === "api") return false;
  const regex = new RegExp(/^[a-zA-Z0-9_]+$/g);
  const result = handle.match(regex);
  return !!result;
}

export const invalid_handle_error_message: string =
  "핸들 형식이어야 합니다.(영어 대소문자, 숫자, 언더스코어 _ 15자 이하)";

export function isValidPassword(password: string): boolean {
  if (password === "") return false;
  if (password.length < password_min_length) return false;
  if (password.indexOf(" ") > -1) return false;
  if (password.indexOf("\t") > -1) return false;
  if (password.indexOf("\n") > -1) return false;
  return true;
}

export const invalid_password_error_message: string = `비밀번호는 최소 ${password_min_length}자 이상이어야 합니다.`;

export function isValidPostTitle(title: string): boolean {
  if (title.length > post_title_max_length) return false;
  return true;
}

export const invalid_post_title_error_message: string = `제목은 최대 ${post_title_max_length}자 이하이어야 합니다.`;

export function isValidPostContent(content: string): boolean {
  if (content.length > post_content_max_length) return false;
  return true;
}

export const invalid_post_content_error_message: string = `내용은 최대 ${post_content_max_length}자 이하이어야 합니다.`;

export function isValidReply(reply: string): boolean {
  if (reply.length > reply_max_length) return false;
  return true;
}

export const invalid_reply_error_message: string = `댓글은 최대 ${reply_max_length}자 이하 이어야 합니다.`;
