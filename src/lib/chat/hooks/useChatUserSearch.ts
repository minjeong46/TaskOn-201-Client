import { useQuery } from "@tanstack/react-query";
import useMe from "@/lib/user/useMe";
import {
    searchChatUsers,
    ChatUser,
    SearchChatUsersData,
} from "@/lib/chat/chatApi";
import { ApiError } from "../../auth/authApi";

type Params = {
    keyword: string;
    page?: number;
    size?: number;
    sort?: string[];
};

export function useChatUserSearch({
    keyword,
    page = 0,
    size = 20,
    sort = [],
}: Params) {
    const { data: me } = useMe();
    const keywordTrimmed = keyword.trim();
    const sortKey = sort.join(",");

    return useQuery<SearchChatUsersData, ApiError>({
        queryKey: ["chatUserSearch", keywordTrimmed, page, size, sortKey],
        enabled: keywordTrimmed.length > 0,
        queryFn: async () => {
            return await searchChatUsers({
                keyword: keywordTrimmed,
                page,
                size,
                sort,
            });
        },

        // 나 제외하고 반환(가공)
        select: (slice) => {
            const list = slice.content ?? [];
            const filtered =
                me?.userId != null
                    ? list.filter((user) => user.userId !== me.userId)
                    : list;

            return { ...slice, content: filtered as ChatUser[] };
        },
        staleTime: 2_000,
    });
}
