import { useRouter } from "next/router";
import usePrevious from "./usePrevious";

export default function usePreviousRoute() {
  return usePrevious(useRouter());
}
