interface ParticipantsData {
    userId: number;
    profileImageUrl: string;
}
export interface ChatRoomData {
    chatRoomId: number;
    roomName: string;
    participants: ParticipantsData[];
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export interface ChatMessage {
    messageId: number;
    chatRoomId: number;
    sender: {
        userId: number;
        name: string;
        profileImageUrl?: string | null;
    };
    content: string;
    sentTime: string;
    displayTime: string;
}