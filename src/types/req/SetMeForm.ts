import { z } from "zod";

export const setMeSchema = z.object({
  avatarId: z.string(),
});

type SetMeForm = z.infer<typeof setMeSchema>;

export type { SetMeForm };
