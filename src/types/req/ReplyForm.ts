import { z } from "zod";
import { reply_max_length } from "../../utils/constraint";
import {
  invalid_reply_error_message,
  invalid_handle_error_message,
  isValidHandle,
} from "../../utils/validator";

export const replySchema = z.object({
  handle: z.custom<string>((val) => isValidHandle(val as string), {
    message: invalid_handle_error_message,
  }),
  content: z
    .string()
    .max(reply_max_length, {
      message: invalid_reply_error_message,
    })
    .min(1, { message: "댓글을 입력하세요" }),
  postId: z.string(),
  targetId: z.string().or(z.undefined()),
});
type ReplyForm = z.infer<typeof replySchema>;

export type { ReplyForm };
