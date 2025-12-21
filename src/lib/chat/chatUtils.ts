import { ChatMessage, ChatRoomData } from "@/app/inbox/type";
import { Client } from "@stomp/stompjs";
import { debounce } from "lodash";
import { RefObject } from "react";

// 메시지 보내기 STOMP
export function sendChatMessage(
    clientRef: RefObject<Client | null>,
    chatRoomId: number,
    content: string
) {
    const client = clientRef.current;
    if (!client || !client.connected) throw new Error("STOMP 연결 실패");

    client.publish({
        destination: `/app/chat/rooms/${chatRoomId}`,
        body: JSON.stringify({ content }), // 매핑
    });
}

// sender 찾기 -> 메세지 실시간 전송시 senderId 값만 존재하므로 Rest message 조회에서 찾도록
export function findSender(
    messages: ChatMessage[] | undefined,
    senderId: number
) {
    return messages?.find((m) => m.sender.userId === senderId)?.sender;
}

// sender 가 해당하는 방 찾기
// export function findSenderFromRoom(room: ChatRoomData, senderId: number) {
//     const p = room.participants.find((p) => p.userId === senderId);
//     if (!p) return null;

//     return {
//         userId: p.userId,
//         name: "알 수 없음", // ← 히스토리 없을 때만
//         profileImageUrl: p.profileImageUrl,
//     };
// }

// 채팅방 리스트 조회 날짜 변환용
// value: "251113T231154"
export const parseCompactDateTime = (value: string): Date | null => {
    if (!/^\d{6}T\d{6}$/.test(value)) return null;

    const y = Number(value.slice(0, 2));
    const m = Number(value.slice(2, 4));
    const d = Number(value.slice(4, 6));
    const h = Number(value.slice(7, 9));
    const min = Number(value.slice(9, 11));
    const s = Number(value.slice(11, 13));

    const year = 2000 + y;

    return new Date(year, m - 1, d, h, min, s);
};

// 24시간이 넘어가면 "방금전" -> 2025-12-21 형태로
export const formatChatRoomTime = (value: string) => {
    if (!value) return "";

    // 그냥 문자열이면 그대로 사용 ("방금전","10분 전"...)
    if (!value.includes("T")) {
        return value;
    }

    const date = parseCompactDateTime(value);
    if (!date) return value;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        const h = date.getHours().toString().padStart(2, "0");
        const m = date.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }

    const y = date.getFullYear();
    const mo = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${mo}-${d}`;
};

// 시간 계산(sort 용)
export function parseTime(value?: string) {
    if (!value) return 0;

    if (value === "방금 전") return Date.now();

    const minMatch = value.match(/(\d+)분 전/);
    if (minMatch) {
        return Date.now() - Number(minMatch[1]) * 60 * 1000;
    }

    const t = Date.parse(value);
    return isNaN(t) ? 0 : t;
}

// 룸 최신 반영 -> 폴링 시 사용
export const invalidateRooms = debounce((queryClient) => {
    queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
}, 300);
