# AI-Play User Project Managing

AI Play 사용자의 머신 러닝 프로젝트 관리 기능을 위한 서버

## Stack

-   Fastify(Node.js)
-   MongoDB

## 준비 사항

-   npm
-   docker(mongodb image)

```
// package.json에 있는 것들 설치
npm i

// docker mongodb container 실행
docker run -d --name mongo -p 27017:27017 mongo --auth
// admin db로 접속
docker exec -it mongo mongo admin
// admin 계정 생성
db.createUser( { user: "admin", pwd: "aiplay", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] } )
// admin 계정으로 접속
docker exec -it mongo mongo -u admin -p aiplay
// 새로운 user 생성 및 db 권한 부여
db.createUser( { user: "test", pwd: "aiplay", roles: [ { role: "readWrite", db: "test" } ] } )

// 새로운 db 생성
docker exec -it mongo mongo
use test
db.auth("test", "aiplay")
db.ml_proj_structure.insert({  "user_idx": 1,  "proj_idx": 1,  "layout": []})
```

## 개발 서버 실행

```
npm run dev
```
