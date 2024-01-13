import { z } from "zod";
import {
  post_content_max_length,
  post_title_max_length,
} from "../../utils/constraint";
import {
  invalid_post_content_error_message,
  invalid_post_title_error_message,
} from "../../utils/validator";

export const postSchema = z.object({
  title: z
    .string()
    .max(post_title_max_length, {
      message: invalid_post_title_error_message,
    })
    .min(1, { message: "제목을 입력하세요" }),
  content: z.string().max(post_content_max_length, {
    message: invalid_post_content_error_message,
  }),
  imageId: z.string(),
});
type PostForm = z.infer<typeof postSchema>;

export type { PostForm };
