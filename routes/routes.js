import { loadProject, loadProjects, saveProject, updateProject, deleteProject, deleteAllProjects } from "../controllers/proj.schema.js";

const routes = async (fastify, options) => {
  // console.log("routes.js in");
  fastify.get("/", async (request, reply) => {
    return { hello: "fastify" };
  });

  // MongoDB
  fastify.get("/project", loadProjects);
  fastify.get("/project/:user_idx/:proj_idx", loadProject);
  fastify.post("/project", saveProject);
  fastify.put("/project/:user_idx/:proj_idx", updateProject);
  fastify.delete("/project/:user_idx/:proj_idx", deleteProject);
  fastify.delete("/project", deleteAllProjects);

  // PostgreSQL
  // 연결 테스트 코드
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

  // 새 프로젝트 생성 기능
  fastify.post("/project/new", (req, rep) => {
    // console.log(req.body);
    const user_idx = req.body.user_idx;
    const proj_name = req.body.proj_name;
    const layout = req.body.layout;
    console.log(user_idx);
    console.log(proj_name);
    // SQL DB에 먼저 프로젝트 정보 저장
    return fastify.pg.transact(async (client) => {
      const sqlResult = await client.query("INSERT INTO ml_project (user_idx, proj_name) VALUES($1, $2) RETURNING idx", [user_idx, proj_name]);
      // console.log(sqlResult);
      if (sqlResult.rowCount === 0) {
        throw new Error("SQL error : Project creation failed");
      }
      const idx = sqlResult.rows[0].idx;
      const collection = fastify.mongo.db.collection("ml_proj_structure");
      const nosqlResult = await collection.insertOne({
        user_idx: user_idx,
        proj_idx: idx, // GET parameter는 모두 문자열로 취급되기에 저장도 문자열로 함
        proj_name: proj_name,
        layout: layout,
      });
      console.log(nosqlResult.acknowledged);
      return nosqlResult.acknowledged ? idx : "NoSQL error : Project creation failed";
    });
  });

  // 프로젝트명 변경 기능
  fastify.put("/project/name/:user_idx/:proj_idx", (req, rep) => {
    console.log(req.params);
    const user_idx = Number(req.params.user_idx);
    const proj_idx = Number(req.params.proj_idx);
    const proj_name = req.body.proj_name;

    return fastify.pg.transact(async (client) => {
      const sqlResult = await client.query("UPDATE ml_project SET proj_name=$3, last_update=NOW() WHERE idx=$1 AND user_idx=$2", [
        proj_idx,
        user_idx,
        proj_name,
      ]);
      // console.log(sqlResult);
      if (sqlResult.rowCount === 0) {
        throw new Error("SQL error : Project name change failed");
      }
      const collection = fastify.mongo.db.collection("ml_proj_structure");
      const nosqlResult = await collection.updateOne(
        {
          user_idx: user_idx,
          proj_idx: proj_idx,
        },
        {
          $set: {
            proj_name: proj_name,
          },
        }
      );
      return nosqlResult.acknowledged ? true : "NoSQL error : Project name change failed";
    });
  });

  // 사용자 프로젝트 목록 불러오기 기능
  fastify.get("/project/list/:user_idx", (req, rep) => {
    fastify.pg.query("SELECT idx, user_idx, proj_name FROM ml_project WHERE user_idx=$1", [Number(req.params.user_idx)], function onResult(err, result) {
      console.log(err || result.rows);
      rep.send(err || result.rows);
    });
  });

  // 프로젝트 삭제 기능
  //   fastify.delete("/project", (req, rep) => {
  //     console.log(req.body);
  //     const user_idx = req.body.user_idx;
  //     const proj_name = req.body.proj_name;
  //     return fastify.pg.transact(async (client) => {
  //       const idx = await client.query("INSERT INTO ml_project (user_idx, proj_name) VALUES($1, $2) RETURNING idx", [user_idx, proj_name]);
  //       console.log(idx);
  //       return idx;
  //     });
  //   });
};

export default routes;
