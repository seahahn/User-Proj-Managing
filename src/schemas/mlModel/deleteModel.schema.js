import { mlModelOwnerModel } from "../models/mlModel.model.js";
import { deleteModelInS3 } from "../utils/s3.js";
import { sendModelList } from "../utils/util.js";

const deleteModel = {
    schema: {
        description: `Delete model data
    * 모델 데이터 삭제 스키마
    * SQL 및 S3에 저장된 모델 데이터를 삭제함.
    * 삭제 후에는 최신화된 모델 목록을 반환함.`,
        tags: ["model", "delete"],
        params: mlModelOwnerModel,
        response: {
            201: {
                description: "Model deleted",
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
        const userIdx = Number(req.params.user_idx);
        const modelIdx = Number(req.params.model_idx);

        // SQL DB의 데이터 삭제
        this.pg.query("DELETE FROM ml_model WHERE idx=$1 AND user_idx=$2 RETURNING model_name", [modelIdx, userIdx], async (err, result) => {
            if (err) {
                rep.send(err);
            } else {
                // S3에 모델 파일 삭제
                console.log(result);
                const modelName = result.rows[0].model_name;
                await deleteModelInS3(userIdx, modelName);

                // 작업 후에 최신화된 모델 목록을 반환
                sendModelList(this, userIdx, rep);
            }
        });
    },
};

export default deleteModel;
