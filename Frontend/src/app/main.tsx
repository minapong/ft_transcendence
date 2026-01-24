import { initRouter, useEffect } from "Reactor"
import { connectPresenceWS } from "@/core/lib/presence";
import { getAuth } from "@/core/lib/auth";
import "./global.css"

const auth = getAuth();
if (auth?.token) {
  connectPresenceWS();
}

initRouter();