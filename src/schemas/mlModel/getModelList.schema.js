import _ from "lodash";
import { mlModelOwnerModel, mlModelsModel } from "../models/mlModel.model.js";
// import { KEY_PREFIX, getModelListInS3, organizedModelList } from "../utils/s3.js";
import { sendModelList } from "../utils/util.js";

const getModelList = {
    schema: {
        description: `Return model list for the user
    * 사용자의 ML 모델 목록 불러오기 스키마
    * 사용자 고유 번호를 이용하여 SQL DB에 저장된 모델 목록을 불러옴
    * {idx, model_name, size} 형태의 원소로 구성된 배열을 반환함
    * (size는 S3에 저장된 모델 파일의 크기를 가져옴. 단위 Byte))`,
        tags: ["model", "load"],
        params: mlModelOwnerModel,
        response: {
            200: mlModelsModel,
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
        sendModelList(this, userIdx, rep);
    },
};

export default getModelList;
