import { mlProjectModel } from "../models/mlProject.model.js";

const saveProject = {
    schema: {
        description: `Save project structure
    * 프로젝트 데이터 저장 스키마
    * SQL DB에 먼저 데이터를 추가
    * 추가에 성공하면 이어서 NoSQL DB에 데이터를 추가
    * 최종적으로 추가된 프로젝트의 고유 번호를 반환`,
        tags: ["project", "save"],
        body: mlProjectModel,
        response: {
            201: {
                description: "Project data saving",
                type: "object",
                properties: {
                    result: { type: "number" },
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
        const user_idx = req.body.user_idx;
        const proj_name = req.body.proj_name;
        const layout = req.body.layout;

        this.pg.transact((client, commit) => {
            // SQL DB에 데이터 추가
            client.query("INSERT INTO ml_project (user_idx, proj_name) VALUES($1, $2) RETURNING idx", [user_idx, proj_name], async (err, sqlResult) => {
                // console.log(sqlResult);
                if (sqlResult.rowCount === 0) {
                    throw new Error("SQL error : Project creation failed");
                }
                const idx = sqlResult.rows[0].idx;
                // console.log(idx);
                // throw new Error("Test error : commit test");

                // NoSQL DB에 데이터 추가
                const collection = this.mongo.db.collection("ml_proj_structure");
                // console.log("collection");
                const nosqlResult = await collection.insertOne({
                    user_idx: user_idx,
                    proj_idx: idx,
                    proj_name: proj_name,
                    layout: layout,
                });
                // console.log(nosqlResult);
                // return nosqlResult.acknowledged ? idx : new Error("NoSQL error : Project creation failed");
                if (nosqlResult.acknowledged) {
                    // NoSQL 데이터 추가 성공 시 SQL DB의 데이터 추가 확정
                    commit(err, sqlResult);
                    // console.log("commited");
                    // console.log(idx);
                    rep.send(idx);
                } else {
                    rep.send(new Error("NoSQL error : Project creation failed"));
                    throw new Error("NoSQL error : Project creation failed");
                }
            });
        });
    },
};

export default saveProject;
