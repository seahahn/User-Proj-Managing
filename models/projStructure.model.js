// 1개 프로젝트 스키마
const mlProjectModel = {
  type: "object",
  required: ["user_idx"],
  additionalProperties: false,
  properties: {
    idx: { type: "number" }, // proj_idx의 SQL DB 컬럼명은 idx
    user_idx: { type: "number" },
    proj_idx: { type: "number" },
    proj_name: { type: "string" },
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
  required: ["user_idx"],
  additionalProperties: false,
  properties: {
    user_idx: { type: "number" },
    proj_idx: { type: "number" },
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

// 프로젝트명 스키마
const mlProjectNameModel = {
  type: "object",
  required: ["proj_name"],
  additionalProperties: false,
  properties: {
    proj_name: { type: "string" },
  },
};

export { mlProjectModel, mlProjectsModel, mlProjectOwnerModel, mlProjectLayoutModel, mlProjectNameModel };
