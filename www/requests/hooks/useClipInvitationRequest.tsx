import { TInvitation } from "lib/types";
import useSWR from "swr";

export function useClipInvitationRequest(
  clipId?: string
): {
  invitations: TInvitation[];
  loading: boolean;
  error: Object;
} {
  const { data, error } = useSWR(`/api/invitations?clipId=${clipId}`, {
    revalidateOnFocus: false,
    refreshInterval: 3600000, // 1 hour
    dedupingInterval: 3600000,
  });

  const loading = !data;

  return {
    invitations: data?.invitations,
    loading,
    error,
  };
}
