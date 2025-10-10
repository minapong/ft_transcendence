# 🐳 ft_transcendence – Docker Setup

## 🧭 Overview
This folder contains all **Docker configuration files** used to build and run the entire ft_transcendence project.  
It ensures the app can be launched with **a single command** (`docker compose up`) and provides  
a fully containerized environment with **HTTPS (TLS 1.2/1.3)** support.

---

## 🧱 Base Responsibilities
- Run **frontend + backend** together with one command.  
- Include **SQLite database** persistence inside a volume.  
- Configure **HTTPS (SSL/TLS)** for both frontend and backend.  
- Manage environment variables securely through `.env` files.  
- Auto-restart containers on crash or error.  

---

## ⚙️ Folder Structure
```bash
docker/
├── nginx/
│   ├── nginx.conf          # Reverse proxy config for HTTPS
│   ├── certs/              # SSL certificates (.pem / .key)
│   └── Dockerfile          # NGINX Docker build
│
├── compose.yml             # Main Docker Compose file
├── .env.example            # Example environment variables
└── README.md


---

🔐 Environment Variables

Example .env file (in project root):

# Docker configuration
FRONTEND_PORT=443
BACKEND_PORT=3000

# SSL certificates
SSL_CERT_PATH=./docker/nginx/certs/cert.pem
SSL_KEY_PATH=./docker/nginx/certs/key.pem


---

🚀 Launch Instructions

To start all services:

docker compose up --build

To stop and remove all containers:

docker compose down

To rebuild everything clean:

docker compose build --no-cache


---

🌐 HTTPS & NGINX

NGINX acts as the sole entry point to the system.

All traffic is routed through port 443 using TLS v1.2/v1.3.

It redirects http:// → https:// automatically.

Backend (Fastify) and Frontend (Vite or React) communicate internally via Docker network.



---

👤 Maintainer

Natalia – Docker environment, NGINX proxy, SSL/TLS setup, and secure deployment.


---
