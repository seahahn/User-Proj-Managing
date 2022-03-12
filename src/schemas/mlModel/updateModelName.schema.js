import { mlModelOwnerModel, mlModelNameModel } from "../models/mlModel.model.js";
import { copyModelInS3, deleteModelInS3 } from "../utils/s3.js";
import { sendModelList } from "../utils/util.js";

const updateModelName = {
    schema: {
        description: `Update model name
    * ML 모델명 수정 스키마
    * 사용자 및 모델 고유 번호와 함께 새 모델명을 받아 SQL DB 데이터에 반영함.
    * 이때, S3에 저장된 모델 파일의 이름도 변경함.
    * 수정 후에는 최신화된 모델 목록을 반환함.`,
        tags: ["model", "update"],
        params: mlModelOwnerModel,
        body: mlModelNameModel,
        response: {
            201: {
                description: "Model name changing",
                type: "object",
                properties: {
                    result: { type: "array" },
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
        const userIdx = Number(req.params.user_idx);
        const modelIdx = Number(req.params.model_idx);
        const oldModelName = req.body.old_model_name;
        const newModelName = req.body.model_name;

        // SQL DB의 데이터 변경
        this.pg.query(
            "UPDATE ml_model SET model_name=$3, last_update=NOW() WHERE idx=$1 AND user_idx=$2",
            [modelIdx, userIdx, newModelName],
            async (err, result) => {
                if (err) {
                    rep.send(err);
                } else {
                    // S3에 모델 파일 이름 변경
                    // 객체명을 직접 수정하는 방법이 없어 동일 객체를 복사한 후 기존 객체를 삭제함
                    await copyModelInS3(userIdx, oldModelName, newModelName);
                    await deleteModelInS3(userIdx, oldModelName);

                    // 작업 후에 최신화된 모델 목록을 반환
                    sendModelList(this, userIdx, rep);
                }
            }
        );
    },
};

export default updateModelName;
