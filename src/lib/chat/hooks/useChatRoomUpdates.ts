import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { ChatRoomData } from "../../../app/inbox/type";

type RoomUpdatePayload = {
    roomId: number;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount?: number;
    senderId: number;
};

// 채팅방 리스트 구독
export function useChatRoomUpdates(
    client: Client | null,
    connected: boolean,
    selectedRoomId: number | null
) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!client || !connected) return;

        console.log("SUBSCRIBE rooms list => /topic/chat/rooms");

        // 채팅 구독
        const sub = client.subscribe(`/topic/chat/rooms/`, (msg: IMessage) => {
            const payload: RoomUpdatePayload = JSON.parse(msg.body);

            console.log("1", payload);

            // 새로 업데이트
            queryClient.setQueryData<ChatRoomData[]>(["chatRooms"], (prev) => {
                if (!prev) return prev;

                console.log("2", payload);

                const next = prev.map((room) => {
                    if (room.chatRoomId !== payload.roomId) return room;

                    const isSelected = selectedRoomId === payload.roomId;

                    return {
                        ...room,
                        lastMessage: payload.lastMessage,
                        lastMessageTime: isSelected
                            ? "방금 전"
                            : payload.lastMessageTime ?? room.lastMessageTime,
                        unreadCount: room.unreadCount,
                    };
                });

                next.sort((a, b) => {
                    const aLastTime = a.lastMessageTime
                        ? new Date(a.lastMessageTime).getTime()
                        : 0;
                    const bLastTime = b.lastMessageTime
                        ? new Date(b.lastMessageTime).getTime()
                        : 0;
                    return bLastTime - aLastTime;
                });

                return next;
            });
        });
        return () => sub.unsubscribe();
    }, [client, connected, selectedRoomId, queryClient]);
}
