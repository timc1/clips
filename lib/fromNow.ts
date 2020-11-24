export default function fromNow(time?: number): string {
  const now = new Date();

  const diff = now.getTime() - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return "less than a minute ago";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (days <= 31) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  if (months < 12) {
    return `over ${months} ${months === 1 ? "month" : "months"} ago`;
  }

  return `over ${years} ${years === 1} ? "year" : "years" ago`;
}
