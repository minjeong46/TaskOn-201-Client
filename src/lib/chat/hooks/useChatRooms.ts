import { useQuery } from "@tanstack/react-query";
import { getChatRooms } from "../chatApi";
import { parseTime } from "../chatUtils";

export function useChatRooms() {
    return useQuery({
        queryKey: ["chatRooms"],
        queryFn: getChatRooms,
        staleTime: 10_000,

        // 채팅방 리스트 폴링
        refetchInterval: 3000,
        refetchIntervalInBackground: false,

        select: (rooms) => {
            return [...rooms].sort((a, b) => {
                const aLastTime = parseTime(a.lastMessageTime);
                const bLastTime = parseTime(b.lastMessageTime);
                return bLastTime - aLastTime;
            });
        },
    });
}
