import { z } from "zod";
import { reply_max_length } from "../../utils/constraint";
import { invalid_reply_error_message } from "../../utils/validator";

export const replyUpdateSchema = z.object({
  replyId: z.string(),
  content: z
    .string()
    .max(reply_max_length, {
      message: invalid_reply_error_message,
    })
    .min(1, { message: "댓글을 입력하세요" }),
});
type ReplyUpdateForm = z.infer<typeof replyUpdateSchema>;

export type { ReplyUpdateForm };
