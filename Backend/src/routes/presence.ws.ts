import { FastifyInstance } from "fastify";
import { setOnline, setOffline, listOnline } from "../presence/store.js";

export async function registerPresenceWs(server: FastifyInstance) {
  server.get(
    "/ws/presence",
    { websocket: true },
    (connection, req) => {
      try {
        const token = (req.query as any)?.token;
        if (!token) {
          connection.socket.close();
          return;
        }

        const payload = server.jwt.verify(token) as any;
        const userId = Number(payload.userId);

        if (!Number.isFinite(userId)) {
          connection.socket.close();
          return;
        }

        // mark online
        setOnline(userId);

        // send hello
        connection.socket.send(
          JSON.stringify({
            type: "hello",
            userId,
            online: listOnline(),
          })
        );

        // cleanup on disconnect
        connection.socket.on("close", () => {
          setOffline(userId);
        });
      } catch {
        connection.socket.close();
      }
    }
  );
}
