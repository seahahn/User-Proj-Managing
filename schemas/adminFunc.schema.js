import { mlProjectsModel } from "../models/projStructure.model.js";

// 프로젝트 리스트 로드 스키마
const loadProjects = {
  schema: {
    description: "Load All project structures for Admin",
    tags: ["project", "load", "admin"],
    response: {
      200: mlProjectsModel,
    },
  },
  handler: async function (req, rep) {
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error("No documents found");
    }
    return result;
  },
};

const deleteAllProjects = {
  schema: {
    description: `Delete all projects
    * 전체 프로젝트 데이터 삭제 스키마
    * SQL 및 NoSQL에 저장된 모든 프로젝트 데이터를 삭제함
    * 이 스키마는 관리자만 사용할 수 있음`,
    tags: ["delete", "admin"],
    response: {
      201: {
        description: "All project structures deleted",
        type: "object",
        properties: {
          result: { type: "string" },
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
  handler: async function deleteAllProjects(req, rep) {
    this.pg.transact((client, commit) => {
      // SQL DB의 데이터 삭제
      client.query("DELETE FROM ml_project", [], async (err, sqlResult) => {
        console.log(sqlResult);
        if (sqlResult.rowCount === 0) {
          throw new Error("SQL error : Projects deletion failed");
        }
        // NoSQL DB의 데이터 삭제
        const collection = this.mongo.db.collection("ml_proj_structure");
        console.log("collection");
        const nosqlResult = await collection.deleteMany({});
        console.log(nosqlResult);
        if (nosqlResult.acknowledged) {
          // NoSQL 데이터 삭제 성공 시 SQL DB의 데이터 삭제 확정
          commit(err, sqlResult);
          console.log("commited");
          rep.send("All projects deleted");
        } else {
          rep.send(new Error("NoSQL error : Projects deletion failed"));
          throw new Error("NoSQL error : Projects deletion failed");
        }
      });
    });
  },
};

export { loadProjects, deleteAllProjects };
