export type NotificationResponse = {
  from: string;
  target: string;
  type:
    | "LIKE_POST"
    | "LIKE_REPLY"
    | "FOLLOW"
    | "REPLY_POST"
    | "REPLY_REPLY"
    | "PWD_CHANGED";
  link: string;
  timestamp: number;
};
