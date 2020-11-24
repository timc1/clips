import queryString from "query-string";

export function clipLocation({
  username,
  clipId,
  options,
}: {
  username: string;
  clipId: string;
  options?: {
    commentId?: string;
  };
}) {
  const query = options ? `?${queryString.stringify(options)}` : "";
  return `/${username}/clip/${clipId}${query}`;
}
