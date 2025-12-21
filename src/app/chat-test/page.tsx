"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Client, IFrame } from "@stomp/stompjs";
import { createStompClient } from "@/lib/chat/stompClient"; // 네 createStompClient 경로
import { getAccessToken } from "@/lib/auth/authStorage";

export default function StompConnectTest() {
  const clientRef = useRef<Client | null>(null);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "disconnected" | "error"
  >("idle");

  const accessToken = getAccessToken();
  // 토큰 바뀌면 새로 만들 준비
  const headersKey = useMemo(() => accessToken ?? "no-token", [accessToken]);

  const connect = () => {
    if (clientRef.current?.active) {
      console.log("이미 active 상태");
      return;
    }

    setStatus("connecting");

    const client = createStompClient({
      accessToken,
      onConnect: () => {
        console.log("✅ STOMP CONNECTED");
        setStatus("connected");
      },
      onDisconnect: () => {
        console.log("🟡 STOMP DISCONNECTED");
        setStatus("disconnected");
      },
      onStompError: (frame: IFrame) => {
        console.error("❌ STOMP ERROR", frame.headers["message"], frame.body);
        setStatus("error");
      },
    });

    // 추가 로그(있으면 편함)
    client.onWebSocketClose = (evt) => {
      console.error("WS CLOSE", {
        code: evt.code,
        reason: evt.reason,
        wasClean: evt.wasClean,
      });
      setStatus("disconnected");
    };
    client.onWebSocketError = (evt) => {
      console.error("WS ERROR", evt);
      setStatus("error");
    };

    clientRef.current = client;
    client.activate();
  };

  const disconnect = async () => {
    const client = clientRef.current;
    if (!client) return;

    console.log("⛔ deactivate()");
    await client.deactivate(); // 연결 종료
    clientRef.current = null;
    setStatus("disconnected");
  };

  // 컴포넌트 언마운트 시 안전하게 끊기
  useEffect(() => {
    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [headersKey]);

  return (
    <div className="p-4 border rounded-xl space-y-2">
      <div className="text-sm">
        status: <b>{status}</b>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded-lg border"
          onClick={connect}
          disabled={status === "connecting" || status === "connected"}
        >
          Connect
        </button>
        <button
          className="px-3 py-2 rounded-lg border"
          onClick={disconnect}
          disabled={status !== "connected" && status !== "connecting"}
        >
          Disconnect
        </button>
      </div>

      <div className="text-xs text-gray-500">
        콘솔에서 ✅ CONNECTED / WS CLOSE / STOMP ERROR 로그 확인
      </div>
    </div>
  );
}
