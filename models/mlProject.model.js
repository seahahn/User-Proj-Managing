// 1개 프로젝트 스키마
const mlProjectModel = {
    type: "object",
    required: ["user_idx", "proj_idx", "layout"],
    additionalProperties: false,
    properties: {
        user_idx: { type: "string" },
        proj_idx: { type: "string" },
        layout: { type: "array" },
    },
};

// 프로젝트 리스트 스키마
const mlProjectsModel = {
    type: "array",
    items: mlProjectModel,
};

// 프로젝트 사용자 정보 스키마
const mlProjectOwnerModel = {
    type: "object",
    required: ["user_idx", "proj_idx"],
    additionalProperties: false,
    properties: {
        user_idx: { type: "string" },
        proj_idx: { type: "string" },
    },
};

// 프로젝트 구조 스키마
const mlProjectLayoutModel = {
    type: "object",
    required: ["layout"],
    additionalProperties: false,
    properties: {
        layout: { type: "array" },
    },
};

export { mlProjectModel, mlProjectsModel, mlProjectOwnerModel, mlProjectLayoutModel };
