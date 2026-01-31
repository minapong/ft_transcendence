import { initRouter, useEffect } from "Reactor"
import "@/app/modals";
import { connectPresenceWS } from "@/core/lib/presence";
import { getAuth } from "@/core/lib/auth";
import "@/styles/index.css";
import "./global.css";

const auth = getAuth();
if (auth?.token) {
  connectPresenceWS();
}

initRouter();