import { loadProjects, deleteAllProjects } from "../schemas/adminFunc.schema.js";
import { saveProject, loadProject, updateProject, deleteProject, updateProjName, getProjList } from "../schemas/index.js";

const routes = async (fastify, options) => {
  // fastify 작동 테스트 코드
  fastify.get("/", async (request, reply) => {
    return { hello: "fastify" };
  });

  fastify.post("/project", saveProject); // 새 프로젝트 생성
  fastify.get("/project/:user_idx/:proj_idx", loadProject); // 프로젝트 구조 불러오기
  fastify.put("/project/:user_idx/:proj_idx", updateProject); // 프로젝트 구조 업데이트
  fastify.delete("/project/:user_idx/:proj_idx", deleteProject); // 프로젝트 데이터 삭제
  fastify.put("/project/name/:user_idx/:proj_idx", updateProjName); // 프로젝트명 변경
  fastify.get("/project/list/:user_idx", getProjList); // 사용자 프로젝트 목록 불러오기

  // Admin Functions
  fastify.get("/project", loadProjects); // 모든 프로젝트 데이터(NoSQL) 불러오기
  fastify.delete("/project", deleteAllProjects); // 모든 프로젝트 데이터(NoSQL) 삭제

  // PostgreSQL 연결 테스트 코드
  fastify.get("/project/postgre", (req, rep) => {
    fastify.pg.connect(onConnect);
    function onConnect(err, client, release) {
      if (err) return rep.send(err);

      client.query("SELECT idx FROM users", function onResult(err, result) {
        release();
        rep.send(err || result);
      });
    }
  });
};

export default routes;
