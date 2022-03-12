import { mlModelModel } from "../models/mlModel.model.js";
import { deleteModelInS3 } from "../utils/s3.js";
import { sendModelList } from "../utils/util.js";

const saveModel = {
    schema: {
        description: `Save ML model
    * 모델 정보 저장 스키마
    * SQL DB에 데이터를 추가(S3는 ML-Train에서 추가함).
    * 추가에 성공하면 갱신된 모델 목록을 반환함.`,
        tags: ["model", "save"],
        body: mlModelModel,
        response: {
            201: {
                description: "Model data saving",
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
        const userIdx = req.body.user_idx;
        const modelName = req.body.model_name;

        // 사용자가 이미 만들어 놓은 모델명인지 확인
        this.pg.query("SELECT * FROM ml_model WHERE user_idx=$1 AND model_name=$2", [userIdx, modelName], (err, result) => {
            err
                ? rep.send(err)
                : result.rowCount === 0
                ? // 기존에 존재하지 않는 모델명이면 새로운 모델 정보 추가
                  this.pg.query("INSERT INTO ml_model (user_idx, model_name) VALUES ($1, $2)", [userIdx, modelName], (err, result) => {
                      if (err) {
                          deleteModelInS3(userIdx, modelName); // DB INSERT 에러 발생 시 S3에 저장된 모델 파일 삭제
                          rep.send(err);
                      }
                  })
                : // 기존에 존재하는 모델명이면 최종 수정 시점 업데이트
                  this.pg.query("UPDATE ml_model SET last_update=NOW() WHERE idx=$1 AND user_idx=$2", [result.rows[0].idx, userIdx], async (err, result) => {
                      err && rep.send(err);
                  });
            // 작업 후에 최신화된 모델 목록을 반환
            sendModelList(this, userIdx, rep);
        });
    },
};

export default saveModel;
