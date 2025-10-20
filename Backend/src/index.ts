import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/", async () => {
  return { message: "Hello from Backend!" };
});

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
