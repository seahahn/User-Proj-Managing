import _ from "lodash";
import { loadProjects, deleteAllProjects } from "../schemas/adminFunc.schema.js";
import {
  saveProject,
  loadProject,
  updateProject,
  deleteProject,
  deleteUserData,
  updateProjName,
  getProjList,
  saveModel,
  deleteModel,
  updateModelName,
  getModelList,
  downloadModel,
} from "../schemas/index.js";

const routes = async (fastify, options) => {
  // fastify 작동 테스트 코드
  fastify.get("/", async (request, reply) => {
    return { hello: "fastify" };
  });

  // 프로젝트 관리 기능
  fastify.post("/project", _.assign(saveProject, { onRequest: fastify.authenticate })); // 새 프로젝트 생성
  fastify.get("/project/:user_idx/:proj_idx", _.assign(loadProject, { onRequest: fastify.authenticate })); // 프로젝트 구조 불러오기
  fastify.put("/project/:user_idx/:proj_idx", _.assign(updateProject, { onRequest: fastify.authenticate })); // 프로젝트 구조 업데이트
  fastify.delete("/project/:user_idx/:proj_idx", _.assign(deleteProject, { onRequest: fastify.authenticate })); // 프로젝트 데이터 삭제
  fastify.put("/project/name/:user_idx/:proj_idx", _.assign(updateProjName, { onRequest: fastify.authenticate })); // 프로젝트명 변경
  fastify.get("/project/list/:user_idx", _.assign(getProjList, { onRequest: fastify.authenticate })); // 사용자 프로젝트 목록 불러오기

  // 모델 관리 기능
  fastify.post("/model", _.assign(saveModel, { onRequest: fastify.authenticate })); // 모델 생성
  fastify.get("/model/list/:user_idx", _.assign(getModelList, { onRequest: fastify.authenticate })); // 사용자 모델 목록 불러오기
  fastify.put("/model/name/:user_idx/:model_idx", _.assign(updateModelName, { onRequest: fastify.authenticate })); // 모델명 변경
  fastify.delete("/model/:user_idx/:model_idx", _.assign(deleteModel, { onRequest: fastify.authenticate })); // 모델 데이터 삭제
  fastify.get("/model/download/:user_idx/:model_idx", _.assign(downloadModel, { onRequest: fastify.authenticate })); // 모델 데이터 다운로드

  // 사용자 탈퇴 시 작동할 기능
  fastify.delete("/project/:user_idx/all", _.assign(deleteUserData, { onRequest: fastify.authenticate })); // 탈퇴 시 해당 사용자의 모든 프로젝트 데이터 삭제

  // Admin Functions
  fastify.get("/project", _.assign(loadProjects, { onRequest: fastify.adminAuthenticate })); // 모든 프로젝트 데이터(NoSQL) 불러오기
  fastify.delete("/project", _.assign(deleteAllProjects, { onRequest: fastify.adminAuthenticate })); // 모든 프로젝트 데이터(NoSQL) 삭제

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
