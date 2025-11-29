# README

## Quick Start

### Option 1: Using Make (Recommended)
```bash
# Initial setup
make setup

# Start all services
make start

# Stop services
make stop
```

### Option 2: Manual Setup
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Install dependencies
pnpm install

# 3. Start infrastructure
docker-compose up -d postgres redis kafka zookeeper

# 4. Setup databases
pnpm run db:generate
pnpm run db:migrate

# 5. Start all services
pnpm run start:dev
```

### Option 3: Full Docker Setup
```bash
# Build and start everything
docker-compose up --build
```

## Testing the APIs

Once all services are running, you can access:

- **API Gateway**: http://localhost:3000/api/docs
- **Auth Service**: http://localhost:3001/api/docs 
- **Employee Service**: http://localhost:3002/api/docs
- **Object Service**: http://localhost:3003/api/docs
- **Shift Service**: http://localhost:3004/api/docs

### Example API Calls

1. **Register User**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@security.com","password":"password123","role":"ADMIN"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@security.com","password":"password123"}'
```

3. **Create Employee** (with JWT token):
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId":"user-id","firstName":"John","lastName":"Doe","phoneNumber":"+1234567890","position":"Guard","status":"ACTIVE"}'
```