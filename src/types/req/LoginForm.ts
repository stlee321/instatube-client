import { z } from "zod";
import {
  isValidHandle,
  invalid_handle_error_message,
  invalid_password_error_message,
  isValidPassword,
} from "../../utils/validator";

export const loginSchema = z.object({
  handle: z.custom<string>((val) => isValidHandle(val as string), {
    message: invalid_handle_error_message,
  }),
  password: z.custom<string>((val) => isValidPassword(val as string), {
    message: invalid_password_error_message,
  }),
});
type LoginForm = z.infer<typeof loginSchema>;

export type { LoginForm };
