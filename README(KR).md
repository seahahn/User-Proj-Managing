# ❇️ AI Play User Project Managing

AI Play 사용자의 머신 러닝 프로젝트 관리 기능을 위한 서버

## 1️⃣ Stack

- Fastify(Node.js) 3.27.2
- MongoDB(MongoDB Atlas) 5.0.6
- PostgreSQL(ElephantSQL)
- AWS S3
- JWT
- Swagger

<br/>

## 2️⃣ 배포 플랫폼 및 서버 주소

- 플랫폼 : Vercel
- 주소 : https://user-proj-managing.vercel.app/

<br/>

## :three: API 명세

- DOCS(Swagger) : https://user-proj-managing.vercel.app/docs

| Method             | URL                                  | Description                               |
| ------------------ | ------------------------------------ | ----------------------------------------- |
| 프로젝트 관리 기능 |                                      |                                           |
| POST               | /project                             | 프로젝트 데이터 저장                      |
| GET                | /project/:user_idx/:proj_idx         | 프로젝트 구조 불러오기                    |
| PUT                | /project/:user_idx/:proj_idx         | 프로젝트 구조 업데이트                    |
| DELETE             | /project/:user_idx/:proj_idx         | 프로젝트 데이터 삭제                      |
| PUT                | /project/name/:user_idx/:proj_idx    | 프로젝트명 수정                           |
| GET                | /project/list/:user_idx              | 사용자의 프로젝트 목록 불러오기           |
| 모델 관리 기능     |                                      |                                           |
| POST               | /model                               | 사용자의 ML(머신 러닝) 모델 정보 저장     |
| GET                | /model/list/:user_idx                | 사용자의 ML 모델 목록 불러오기            |
| PUT                | /model/name/:user_idx/:model_idx     | ML 모델명 수정                            |
| DELETE             | /model/:user_idx/:model_idx          | ML 모델 데이터 삭제                       |
| GET                | /model/download/:user_idx/:model_idx | ML 모델 데이터 다운로드                   |
| 사용자 탈퇴 기능   |                                      |                                           |
| DELETE             | /project/:user_idx/all               | 탈퇴한 사용자의 모든 프로젝트 데이터 삭제 |

<br/>

## :four: 트러블 슈팅 기록

- https://github.com/AI-Play/User-Proj-Managing/discussions

<br/>

## :five: 개발 환경 준비 사항

<details>
  <summary><b>준비 사항</b></summary>

- npm
- docker(mongodb image, postgres image)

```
// package.json에 있는 것들 설치
npm i

// MongoDB Setting (localhost 환경)
// 1. .env에 MONGO_URL="mongodb://my-user:my-user-pwd@localhost:27017/my-db" 입력
// 2. docker mongodb container 실행
docker run -d --name my-mongo -p 27017:27017 mongo --auth
// 3. admin db로 접속
docker exec -it my-mongo mongo admin
// 4. admin 계정 생성
db.createUser( { user: "admin", pwd: "admin-pwd", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] } )
// 5. admin 계정으로 접속
docker exec -it my-mongo mongo -u admin -p admin-pwd
// 6. 새로운 user 생성 및 db 권한 부여
db.createUser( { user: "my-user", pwd: "my-user-pwd", roles: [ { role: "readWrite", db: "my-db" } ] } )

// 7. 새로운 db 생성
docker exec -it my-mongo mongo
use my-db
db.auth("my-user", "my-user-pwd")
db.ml_proj_structure.insert({  "user_idx": 1,  "proj_idx": 1,  "layout": []})

// PostgreSQL Setting (localhost 환경)
// 1. .env에 POSTGRES_URL="postgres://<username>:<password>@localhost:5432/postgres" 입력 (username, password는 둘 다 지정한 경우 입력)
// 2. docker postgres container 실행
docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=aiplay -d postgres
// 3. Architecture Repo에 있는 dbscript 실행 (DBeaver 또는 VSCode의 SQL 스크립트 실행 기능 등 이용하기) => 수행 X
// -> User-Auth Repo README 참고하여 적용 필요
```

##### 개발 서버 실행

```
npm run dev
```

</details>
