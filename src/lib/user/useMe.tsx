import { useQuery } from "@tanstack/react-query";
import { fetchMe, UserInfoResponse } from "./userApi";

type MeData = UserInfoResponse["data"];

const useMe = () => {
  return useQuery<MeData | null>({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 1000 * 60, // 데이터 최신 유지 시간
    retry: false, // 재시도
  });
};

export default useMe;
