import { z } from "zod";
import { password_min_length } from "../../utils/constraint";
import {
  invalid_handle_error_message,
  invalid_password_error_message,
  isValidHandle,
} from "../../utils/validator";

export const signInSchema = z.object({
  password: z.string().min(password_min_length, {
    message: invalid_password_error_message,
  }),
  handle: z.custom<string>((val) => isValidHandle(val as string), {
    message: invalid_handle_error_message,
  }),
  avatarId: z.string(),
});
type SignInForm = z.infer<typeof signInSchema>;

export type { SignInForm };
