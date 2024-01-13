import { z } from "zod";
import { password_min_length } from "../../utils/constraint";
import {
  invalid_password_error_message,
  invalid_handle_error_message,
  isValidHandle,
} from "../../utils/validator";

export const signOutSchema = z.object({
  handle: z.custom<string>((val) => isValidHandle(val as string), {
    message: invalid_handle_error_message,
  }),
  password: z.string().min(password_min_length, {
    message: invalid_password_error_message,
  }),
});
type SignOutForm = {
  handle: string;
  password: string;
};

export type { SignOutForm };
