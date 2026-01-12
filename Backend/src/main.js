import Fastify from 'fastify'
import apiRoutes from "./route.js"

const app = Fastify()

app.register(apiRoutes, { prefix: '/api' })

app.listen({ port: 3000, host: '0.0.0.0' })
	.then(() => console.log("fastify live"))