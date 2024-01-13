import { z } from "zod";
import {
  invalid_password_error_message,
  isValidPassword,
} from "../../utils/validator";

export const changePwdSchema = z.object({
  currentPwd: z.string(),
  newPwd: z.custom<string>((val) => isValidPassword(val as string), {
    message: invalid_password_error_message,
  }),
});
type ChangePwdForm = z.infer<typeof changePwdSchema>;

export type { ChangePwdForm };
