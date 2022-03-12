import { mlProjectOwnerModel, mlProjectModel } from "../models/mlProject.model.js";

const loadProject = {
    schema: {
        description: `Load project structure
    * 프로젝트 구조 불러오기 스키마
    * 사용자 및 프로젝트 고유 번호를 이용하여 NoSQL에 저장된 프로젝트 구조(layout)를 불러옴.
    * 동시에 프로젝트의 최종 사용 시점을 기록하기 위해 SQL DB에 저장된 해당 프로젝트의 최종 수정 시점(last_update)을 최신화함.`,
        tags: ["project", "load"],
        params: mlProjectOwnerModel,
        response: {
            200: mlProjectModel,
            default: {
                description: "Unexpected error",
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        },
    },
    handler: async function (req, rep) {
        // console.log(req.params);
        const user_idx = Number(req.params.user_idx);
        const proj_idx = Number(req.params.proj_idx);
        const collection = this.mongo.db.collection("ml_proj_structure");
        const result = await collection.findOne({
            user_idx: user_idx,
            proj_idx: proj_idx,
        });
        if (!result) {
            throw new Error("Invalid value");
        }
        // 프로젝트 최종 수정 시점 최신화
        this.pg.transact(async (client) => {
            await client.query("UPDATE ml_project SET last_update=NOW() WHERE idx=$1", [proj_idx]);
            // return result;
        });
        console.log(result);
        return result;
    },
};

export default loadProject;
