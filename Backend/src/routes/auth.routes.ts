import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";

interface SignupBody {
  email?: unknown;
  username?: unknown;
  password?: unknown;
}

function asTrimmedString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
}

// limits  to avoid DB errors + huge tokens
const MAX_EMAIL = 320;
const MAX_USERNAME = 32;
const MAX_PASSWORD = 128;

export async function registerAuthRoutes(server: FastifyInstance) {
  server.post(
    "/api/auth/signup",
    async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
      // never destructure req.body directly (it can be undefined)
      const body = (req.body ?? {}) as SignupBody;

      const email = asTrimmedString(body.email);
      const username = asTrimmedString(body.username);
      const password = asTrimmedString(body.password);

      // consistent response shape; 200 for expected failures
      if (!email || !username || !password) {
        return reply.code(200).send({ ok: false, error: "Missing fields" });
      }

      if (
        email.length > MAX_EMAIL ||
        username.length > MAX_USERNAME ||
        password.length > MAX_PASSWORD
      ) {
        return reply.code(200).send({ ok: false, error: "Fields too long" });
      }

      try {
        const user = await AuthService.signup(email, username, password);

        const token = server.jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          { expiresIn: "1h" }
        );

        // use 200 to avoid "Created" semantics; also keeps everything uniform
        return reply.code(200).send({ ok: true, user, token });
      } catch (err: any) {
        // map known errors to ok:false (still 200)
        const msg = err?.message;

        if (msg === "EMAIL_ALREADY_EXISTS") {
          return reply.code(200).send({ ok: false, error: "Email already used" });
        }
        if (msg === "USERNAME_ALREADY_EXISTS") {
          return reply.code(200).send({ ok: false, error: "Username already used" });
        }
        if (err?.code === "P2002") {
          return reply
            .code(200)
            .send({ ok: false, error: "Email or username already used" });
        }

        //  no console.error; avoid 500 to prevent browser console errors
        return reply.code(200).send({ ok: false, error: "Server error" });
      }
    }
  );
}
