# AI-Play User Project Managing

Server for managing machine learning projects of AI Play users.

## Stack

- Fastify (Node.js)
- MongoDB
- PostgreSQL

## Prerequisites

- npm
- docker (mongodb image, postgres image)

```
# Install dependencies in package.json
npm i

# MongoDB Setting (localhost environment)
# 1. Enter MONGO_URL="mongodb://test:aiplay@localhost:27017/test" in .env
# 2. Run docker mongodb container
docker run -d --name mongo -p 27017:27017 mongo --auth
# 3. Connect to the admin db
docker exec -it mongo mongo admin
# 4. Create admin account
db.createUser({ user: "admin", pwd: "aiplay", roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })
# 5. Connect with admin account
docker exec -it mongo mongo -u admin -p aiplay
# 6. Create a new user and grant db permission
db.createUser({ user: "test", pwd: "aiplay", roles: [{ role: "readWrite", db: "test" }] })

# 7. Create a new db
docker exec -it mongo mongo
use test
db.auth("test", "aiplay")
db.ml_proj_structure.insert({ "user_idx": 1, "proj_idx": 1, "layout": [] })

# PostgreSQL Setting (localhost environment)
# 1. Enter POSTGRES_URL="postgres://<username>:<password>@localhost:5432/postgres" in .env (enter username and password if specified)
# 2. Run docker postgres container
docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=aiplay -d postgres
# 3. Run the dbscript in the Architecture Repo (Use tools like DBeaver or SQL script execution feature in VSCode) => Not required
# -> Refer to User-Auth Repo README for necessary steps
```

## Run Development Server

```
npm run dev
```

## Deployment Platform and Server Address

- Platform : Vercel
- Address : https://user-proj-managing.vercel.app/
