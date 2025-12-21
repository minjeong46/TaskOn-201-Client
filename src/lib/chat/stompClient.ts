import { Client, IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface CreateClientOptions {
    accessToken: string | null;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onStompError?: (frame: IFrame) => void;
}

export function createStompClient(options: CreateClientOptions) {
    const client = new Client({
        webSocketFactory: () => new SockJS("https://api.taskon.co.kr/ws/chat"),
        connectHeaders: options.accessToken
            ? { Authorization: `Bearer ${options.accessToken}` }
            : {},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => options.onConnect?.(),
        onDisconnect: () => options.onDisconnect?.(),
        onStompError: (frame) => options.onStompError?.(frame),
        onWebSocketClose: (evt) => {
            console.error("WS CLOSE", {
                code: evt.code,
                reason: evt.reason,
                wasClean: evt.wasClean,
            });
        },
        onWebSocketError: (evt) => {
            console.error("WS ERROR", evt);
        },
        // debug: (debug) => console.log(debug),
    });

    return client;
}
