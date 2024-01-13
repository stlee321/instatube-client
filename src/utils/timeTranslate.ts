export function translateTime(nano: number, createdAt: number[]): string {
  createdAt;
  const millis = Math.floor(nano / 1000);
  const now = Date.now();
  const diff = now - millis;
  if (diff < 10000) return "방금전";
  if (diff < 60 * 1000) {
    return Math.floor(diff / 1000) + "초 전";
  }
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + "분 전";
  }
  if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + "시간 전";
  }
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + "일 전";
  }
  if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (30 * 24 * 60 * 60 * 1000)) + "개월 전";
  }
  const date = new Date(millis);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}
