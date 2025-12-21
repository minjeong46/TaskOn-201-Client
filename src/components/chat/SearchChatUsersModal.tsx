"use client";

import { useCallback, useEffect, useState } from "react";
import UserInfoModal from "@/components/modal/UserInfoModal";
import Profile from "@/components/Profile";
import Button from "@/components/Button";
import useMe from "@/lib/user/useMe";
import { useChatUserSearch } from "@/lib/chat/hooks/useChatUserSearch";
import { usePersonalChat } from "@/lib/chat/hooks/usePersonalChat";
import { useDebounce } from "@/lib/useDebounce";

export default function SearchChatUsersModal({
    isOpen,
    onClose,
    onCreated,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (chatRoomId: number) => void;
}) {
    const { data: me } = useMe();
    // 입력값
    const [keywordInput, setKeywordInput] = useState("");

    // 디바운스
    const keyword = useDebounce(keywordInput, 300);

    const {
        data: slice,
        isLoading,
        isError,
    } = useChatUserSearch({
        keyword,
        page: 0,
        size: 20,
    });

    const personalChat = usePersonalChat();

    const users = slice?.content ?? [];
    const hasSearched = keyword.trim().length > 0;

    // 닫을 시
    const handleClose = useCallback(() => {
        setKeywordInput("");
        onClose();
    }, [onClose]);

    // 유저 선택
    const handlePickUser = (userId: number) => {
        if (me?.userId && userId === me.userId) return;

        personalChat.mutate(userId, {
            onSuccess: ({ chatRoomId }) => {
                onCreated(chatRoomId);
                handleClose();
            },
        });
    };

    const loading = isLoading || personalChat.isPending;

    return (
        <UserInfoModal
            isOpen={isOpen}
            onClose={handleClose}
            title="1:1 채팅 생성"
            className="max-w-lg max-h-[400px]"
        >
            <div className="flex flex-col gap-4">
                <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="사용자 검색 (이름/이메일)"
                    className="w-full px-4 py-3 border border-gray2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                />

                <div className="max-h-[360px] overflow-y-auto">
                    {loading && (
                        <div className="py-6 text-sm text-gray4">
                            검색 중...
                        </div>
                    )}

                    {!loading && isError && (
                        <div className="py-6 text-sm text-red-500">
                            다시 시도하세요
                        </div>
                    )}

                    {!loading && !isError && !hasSearched && (
                        <div className="py-6 text-sm text-gray4">
                            검색어를 입력해주세요
                        </div>
                    )}

                    {!loading &&
                        !isError &&
                        hasSearched &&
                        users.length === 0 && (
                            <div className="py-6 text-sm text-gray4">
                                검색 결과가 없습니다
                            </div>
                        )}

                    <div className="flex flex-col">
                        {users.map((user) => (
                            <button
                                key={user.userId}
                                onClick={() => handlePickUser(user.userId)}
                                disabled={loading}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray1/40 text-left disabled:opacity-50"
                            >
                                <Profile
                                    size="sm"
                                    imageUrl={user.profileImageUrl ?? undefined}
                                    userName={user.name}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray5">
                                        {user.name}
                                    </span>
                                    <span className="text-xs text-gray3">
                                        {user.email}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    variant="white"
                    size="sm"
                    label="닫기"
                    onClick={handleClose}
                />
            </div>
        </UserInfoModal>
    );
}
