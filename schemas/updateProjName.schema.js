import { mlProjectOwnerModel, mlProjectNameModel } from "../models/projStructure.model.js";

const updateProjName = {
  schema: {
    description: `Update project name
    * 프로젝트명 수정 스키마
    * 사용자 및 프로젝트 고유 번호와 함께 새 프로젝트명을 받아 SQL과 NoSQL DB 데이터에 반영함`,
    tags: ["project", "update"],
    params: mlProjectOwnerModel,
    body: mlProjectNameModel,
    response: {
      201: {
        description: "Project name changing",
        type: "object",
        properties: {
          result: { type: "boolean" },
        },
      },
      default: {
        description: "Unexpected error",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
  handler: function (req, rep) {
    console.log(req.params);
    const user_idx = Number(req.params.user_idx);
    const proj_idx = Number(req.params.proj_idx);
    const proj_name = req.body.proj_name;

    this.pg.transact((client, commit) => {
      // SQL DB의 데이터 변경
      client.query(
        "UPDATE ml_project SET proj_name=$3, last_update=NOW() WHERE idx=$1 AND user_idx=$2",
        [proj_idx, user_idx, proj_name],
        async (err, sqlResult) => {
          console.log(sqlResult);
          if (sqlResult.rowCount === 0) {
            throw new Error("SQL error : Project name change failed");
          }
          // NoSQL DB의 데이터 변경
          const collection = this.mongo.db.collection("ml_proj_structure");
          console.log("collection");
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
          console.log(nosqlResult);
          // return nosqlResult.acknowledged ? true : "NoSQL error : Project name change failed";
          if (nosqlResult.acknowledged) {
            // NoSQL 데이터 변경 성공 시 SQL DB의 데이터 변경 사항 확정
            commit(err, sqlResult);
            console.log("commited");
            rep.send(true);
          } else {
            rep.send(new Error("NoSQL error : Project name change failed"));
            throw new Error("NoSQL error : Project name change failed");
          }
        }
      );
    });
  },
};

export default updateProjName;
