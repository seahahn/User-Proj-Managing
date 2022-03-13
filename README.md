# AI-Play User Project Managing

AI Play 사용자의 머신 러닝 프로젝트 관리 기능을 위한 서버

## Stack

-   Fastify(Node.js)
-   MongoDB
-   PostgreSQL

## 준비 사항

-   npm
-   docker(mongodb image, postgres image)

```
// package.json에 있는 것들 설치
npm i

// MongoDB Setting (localhost 환경)
// 1. .env에 MONGO_URL="mongodb://localhost:27017/test" 입력
// 2. docker mongodb container 실행
docker run -d --name mongo -p 27017:27017 mongo -- auth
// 3. admin db로 접속
docker exec -it mongo mongo admin
// 4. admin 계정 생성
db.createUser( { user: "admin", pwd: "aiplay", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] } )
// 5. admin 계정으로 접속
docker exec -it mongo mongo -u admin -p aiplay
// 6. 새로운 user 생성 및 db 권한 부여
db.createUser( { user: "test", pwd: "aiplay", roles: [ { role: "readWrite", db: "test" } ] } )

// 7. 새로운 db 생성
docker exec -it mongo mongo
use test
db.auth("test", "aiplay")
db.ml_proj_structure.insert({  "user_idx": 1,  "proj_idx": 1,  "layout": []})

// PostgreSQL Setting (localhost 환경)
// 1. .env에 POSTGRES_URL="postgres://<username>:<password>@localhost:5432/postgres" 입력 (username, password는 둘 다 지정한 경우 입력)
// 2. docker postgres container 실행
docker run -d --name postgres -p 5432:5432 postgres
// 3. Architecture Repo에 있는 dbscript 실행 (DBeaver 또는 VSCode의 SQL 스크립트 실행 기능 등 이용하기)
```

## 개발 서버 실행

```
npm run dev
```
