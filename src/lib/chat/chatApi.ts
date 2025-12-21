import { ChatMessage, ChatRoomData } from "@/app/inbox/type";
import { ApiError } from "../auth/authApi";
import { authFetch } from "../auth/authFetch";

// interface ChatMessageResponse {
//     statusCode: number;
//     message: string;
//     data: ChatMessage[];
// }

// interface SenderData {
//     userId: number;
//     name: string;
//     profileImageUrl: string;
// }

// 메세지 리스트 조회
export async function getChatMessageHistory(
    chatRoomId: number
): Promise<ChatMessage[]> {
    const res = await authFetch(`/api/chat/rooms/${chatRoomId}/messages`, {
        method: "GET",
    });

    const body = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "채팅 메세지 히스토리 조회 실패");
    }

    return body.data as ChatMessage[];
}

// 채팅방 리스트 조회
export async function getChatRooms(): Promise<ChatRoomData[]> {
    const res = await authFetch("/api/chat/rooms", {
        method: "GET",
    });

    const body = await res.json();

    if (!res.ok) {
        throw new ApiError(body.message || "채팅방 리스트 조회 실패");
    }

    return body.data as ChatRoomData[];
}
