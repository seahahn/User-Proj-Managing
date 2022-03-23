import { mlModelOwnerModel } from "../models/mlModel.model.js";
import { downloadModelInS3 } from "../utils/s3.js";

const downloadModel = {
    schema: {
        description: `Download model
    * 모델 데이터 다운로드 스키마
    * S3에 저장된 모델 데이터를 가져옴.
    * 가져온 후에는 프론트앤드로 해당 데이터를 전달함.`,
        tags: ["model", "download"],
        params: mlModelOwnerModel,
        response: {
            200: {
                description: "Model downloaded",
                type: "object",
                properties: {
                    result: { type: "object" },
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

        // 사용자 번호와 모델 번호를 받아서 모델 데이터를 가져옴
        this.pg.query("SELECT * FROM ml_model WHERE user_idx=$1 AND idx=$2", [userIdx, modelIdx], async (err, result) => {
            if (err) {
                rep.send(err);
            } else {
                // 모델명을 이용하여 S3에서 모델 객체를 불러와 이를 프론트앤드에 반환함
                const modelName = result.rows[0].model_name;
                const data = await downloadModelInS3(userIdx, modelName);
                rep.send(data.Body);
            }
        });
    },
};

export default downloadModel;
