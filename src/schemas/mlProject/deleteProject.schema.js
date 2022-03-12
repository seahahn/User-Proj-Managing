import { mlProjectOwnerModel } from "../models/mlProject.model.js";

const deleteProject = {
    schema: {
        description: `Delete project data
    * 프로젝트 데이터 삭제 스키마
    * SQL 및 NoSQL에 저장된 프로젝트 데이터를 삭제함`,
        tags: ["project", "delete"],
        params: mlProjectOwnerModel,
        response: {
            201: {
                description: "Project deleted",
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
    handler: function (req, rep) {
        const user_idx = Number(req.params.user_idx);
        const proj_idx = Number(req.params.proj_idx);
        // console.log(req.params);

        this.pg.transact((client, commit) => {
            // SQL DB의 데이터 삭제
            client.query("DELETE FROM ml_project WHERE idx=$1 AND user_idx=$2", [proj_idx, user_idx], async (err, sqlResult) => {
                console.log(sqlResult);
                if (sqlResult.rowCount === 0) {
                    throw new Error("SQL error : Project deletion failed");
                }
                // NoSQL DB의 데이터 삭제
                const collection = this.mongo.db.collection("ml_proj_structure");
                console.log("collection");
                const nosqlResult = await collection.deleteOne({
                    user_idx: Number(req.params.user_idx),
                    proj_idx: Number(req.params.proj_idx),
                });
                console.log(nosqlResult);
                if (nosqlResult.acknowledged) {
                    // NoSQL 데이터 삭제 성공 시 SQL DB의 데이터 삭제 확정
                    commit(err, sqlResult);
                    console.log("commited");
                    rep.send(true);
                } else {
                    rep.send(new Error("NoSQL error : Project deletion failed"));
                    throw new Error("NoSQL error : Project deletion failed");
                }
            });
        });
    },
};

export default deleteProject;
