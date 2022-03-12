// 1개 ML 모델 스키마
const mlModelModel = {
    type: "object",
    required: ["user_idx"],
    additionalProperties: false,
    properties: {
        idx: { type: "number" }, // model_idx의 SQL DB 컬럼명은 idx
        user_idx: { type: "number" },
        model_idx: { type: "number" },
        model_name: { type: "string" },
        size: { type: "number" }, // S3에 저장된 모델 파일의 크기
    },
};

// ML 모델 리스트 스키마
const mlModelsModel = {
    type: "array",
    items: mlModelModel,
};

// ML 모델 사용자 정보 스키마
const mlModelOwnerModel = {
    type: "object",
    required: ["user_idx"],
    additionalProperties: false,
    properties: {
        user_idx: { type: "number" },
        model_idx: { type: "number" },
    },
};

// ML 모델명 스키마
const mlModelNameModel = {
    type: "object",
    required: ["model_name"],
    additionalProperties: false,
    properties: {
        model_name: { type: "string" },
        old_model_name: { type: "string" },
    },
};

export { mlModelModel, mlModelsModel, mlModelOwnerModel, mlModelNameModel };
