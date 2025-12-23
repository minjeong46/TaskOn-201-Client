"use client";

import { ChatMessage } from "@/app/inbox/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatMessageHistory } from "../chatApi";
import { useEffect } from "react";
import { SIDEBAR_QUERY_KEY } from "@/lib/project/useProjectSidebar";

export function useChatMessageHistory(chatRoomId: number | null) {
    const queryClient = useQueryClient();

    const query = useQuery<ChatMessage[]>({
        queryKey: ["chatMessages", chatRoomId],
        queryFn: () => getChatMessageHistory(chatRoomId as number),
        enabled: !!chatRoomId,
        staleTime: 5000,
    });

    useEffect(() => {
        if (!chatRoomId) return;
        if (!query.isSuccess) return;

        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
        // 사이드바의 unreadChatCount 즉시 갱신
        queryClient.invalidateQueries({ queryKey: [SIDEBAR_QUERY_KEY] });
    }, [chatRoomId, query.isSuccess, query.dataUpdatedAt, queryClient]);

    return query;
}
