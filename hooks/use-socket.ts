"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useAuth } from "@/hooks/use-auth";

export function useRealtime() {
  const { user } = useAuth();
  const pusherRef = useRef<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // extract token from cookie (same cookie name you used earlier)
    const socketToken =
      typeof document !== "undefined"
        ? document.cookie.split("; ").find((c) => c.startsWith("socket_token="))?.split("=")[1] ?? ""
        : "";

    // cleanup when no user
    if (!user) {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // avoid double-init
    if (pusherRef.current) return;

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY ?? "";
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";

    if (!key) {
      console.warn("NEXT_PUBLIC_PUSHER_KEY is not set. Realtime will not initialize.");
      return;
    }

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: "/api/pusher/auth", // optional, only required for private/authenticated channels
      auth: {
        headers: {
          Authorization: `Bearer ${socketToken}`,
        },
      },
    });

    pusher.connection.bind("connected", () => {
      setIsConnected(true);
      console.debug("Pusher connected");
    });

    pusher.connection.bind("disconnected", () => {
      setIsConnected(false);
      console.debug("Pusher disconnected");
    });

    pusher.connection.bind("error", (err: any) => {
      console.error("Pusher connection error:", err);
      setIsConnected(false);
    });

    pusherRef.current = pusher;

    return () => {
      try {
        pusher.disconnect();
      } catch (e) {
        /* ignore */
      }
      pusherRef.current = null;
      setIsConnected(false);
    };
    // only recreate when user changes
  }, [user]);

  return { pusher: pusherRef.current, isConnected };
}
