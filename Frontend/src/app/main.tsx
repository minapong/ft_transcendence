import { initRouter, useEffect } from "@/Reactor"
import { connectPresenceWS } from "@/lib/presence";
import { getAuth } from "@/lib/auth";
import "./global.css"

const auth = getAuth();
if (auth?.token) {
  connectPresenceWS();
}

initRouter();