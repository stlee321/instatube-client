type ReplyResponse = {
  replyId: string;
  postId: string;
  targetId: string;
  handle: string;
  content: string;
  createdAt: number[];
  timestamp: number;
};

export type { ReplyResponse };
