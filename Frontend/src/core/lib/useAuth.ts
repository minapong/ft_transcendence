import { useEffect, useState } from "Reactor";
import { getAuth, setAuth } from "@/core/lib/auth";

const AUTH_EVENT = "auth:changed";

export function useAuth() {
  const [auth, setAuth] = useState(getAuth());

  useEffect(() => {

    const sync = () => setAuth(getAuth());

    //if auth changed while this route was away, catch up now
    sync();

    // fires for same-tab setAuth/clearAuth
    window.addEventListener(AUTH_EVENT, sync);

    // fires for other tabs changing localStorage
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return auth;
}
