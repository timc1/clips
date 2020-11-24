import useSWR from "swr";
import { fetchPage } from "../page";

type Props = {
  page: string | string[];
  initialData?: any;
};

export function usePageRequest(props: Props) {
  const { data, error } = useSWR(
    `/api/page/${props.page}`,
    () => fetchPage(props.page),
    {
      initialData: props.initialData,
      revalidateOnFocus: false,
    }
  );

  const loading = !data;

  return {
    user: data,
    loading,
    error,
  };
}
