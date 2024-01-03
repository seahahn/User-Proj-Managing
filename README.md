# ❇️ AI Play User Project Managing

Server for managing machine learning projects of AI Play users.

## 1️⃣ Stack

- Fastify(Node.js) 3.27.2
- MongoDB(MongoDB Atlas) 5.0.6
- PostgreSQL(ElephantSQL)
- AWS S3
- JWT
- Swagger

<br/>

## 2️⃣ Deployment Platform and Server Address

- Platform : Vercel
- Address : https://user-proj-managing.vercel.app/

<br/>

## :three: API Specification

- DOCS(Swagger) : https://user-proj-managing.vercel.app/docs

| Method             | URL                                  | Description                                         |
| ------------------ | ------------------------------------ | --------------------------------------------------- |
| Project Management |                                      |                                                     |
| POST               | /project                             | Save project data                                   |
| GET                | /project/:user_idx/:proj_idx         | Retrieve project structure                          |
| PUT                | /project/:user_idx/:proj_idx         | Update project structure                            |
| DELETE             | /project/:user_idx/:proj_idx         | Delete project data                                 |
| PUT                | /project/name/:user_idx/:proj_idx    | Modify project name                                 |
| GET                | /project/list/:user_idx              | Retrieve user's project list                        |
| Model Management   |                                      |                                                     |
| POST               | /model                               | Save user's ML (Machine Learning) model information |
| GET                | /model/list/:user_idx                | Retrieve user's ML model list                       |
| PUT                | /model/name/:user_idx/:model_idx     | Modify ML model name                                |
| DELETE             | /model/:user_idx/:model_idx          | Delete ML model data                                |
| GET                | /model/download/:user_idx/:model_idx | Download ML model data                              |
| User Withdrawal    |                                      |                                                     |
| DELETE             | /project/:user_idx/all               | Delete all project data of the withdrawn user       |

<br/>

## :four: Troubleshooting Records

- https://github.com/AI-Play/User-Proj-Managing/discussions

<br/>

## :five: Development Environment Preparation

<details>
  <summary><b>Preparation</b></summary>

- npm
- docker (mongodb image, postgres image)

```
# Install dependencies in package.json
npm i

# MongoDB Setting (localhost environment)
# 1. Enter MONGO_URL="mongodb://my-user:my-user-pwd@localhost:27017/my-db" in .env
# 2. Run docker mongodb container
docker run -d --name my-mongo -p 27017:27017 mongo --auth
# 3. Connect to the admin db
docker exec -it my-mongo mongo admin
# 4. Create admin account
db.createUser({ user: "admin", pwd: "admin-pwd", roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })
# 5. Connect with admin account
docker exec -it my-mongo mongo -u admin -p admin-pwd
# 6. Create a new user and grant db permission
db.createUser({ user: "my-user", pwd: "my-user-pwd", roles: [{ role: "readWrite", db: "my-db" }] })

# 7. Create a new db
docker exec -it mongo mongo
use my-db
db.auth("my-user", "my-user-pwd")
db.ml_proj_structure.insert({ "user_idx": 1, "proj_idx": 1, "layout": [] })

# PostgreSQL Setting (localhost environment)
# 1. Enter POSTGRES_URL="postgres://<username>:<password>@localhost:5432/postgres" in .env (enter username and password if specified)
# 2. Run docker postgres container
docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=aiplay -d postgres
# 3. Run the dbscript in the Architecture Repo (Use tools like DBeaver or SQL script execution feature in VSCode) => Not required
# -> Refer to User-Auth Repo README for necessary steps
```

##### Run Development Server

```
npm run dev
```

</details>
