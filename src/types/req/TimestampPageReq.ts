enum PageDir {
  AFTER,
  BEFORE,
}
type TimestampPageReq = {
  pageDir: PageDir;
  timestamp: number;
  size: number;
};

export { PageDir };
export type { TimestampPageReq };
