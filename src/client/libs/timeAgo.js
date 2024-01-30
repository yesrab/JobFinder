export function timeAgo(timestamp) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const date = new Date(timestamp);

  const diff = (Date.now() - date.getTime()) / 1000;

  const diffInYears = Math.round(diff / 31536000);
  const diffInMonths = Math.round(diff / 2592000);
  const diffInDays = Math.round(diff / 86400);
  const diffInHours = Math.round(diff / 3600);
  const diffInMinutes = Math.round(diff / 60);
  const diffInSeconds = Math.round(diff);

  if (diffInYears > 0) return rtf.format(-diffInYears, "year");
  if (diffInMonths > 0) return rtf.format(-diffInMonths, "month");
  if (diffInDays > 0) return rtf.format(-diffInDays, "day");
  if (diffInHours > 0) return rtf.format(-diffInHours, "hour");
  if (diffInMinutes > 0) return rtf.format(-diffInMinutes, "minute");
  return rtf.format(-diffInSeconds, "second");
}

// Example usage
// const timestamp = "2024-01-26T17:11:05.759Z";
// const result = timeAgo(timestamp);
// console.log(result); // 1 day ago
