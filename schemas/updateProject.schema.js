import { mlProjectOwnerModel, mlProjectLayoutModel } from "../models/projStructure.model.js";

const updateProject = {
  schema: {
    description: `Update project structure
    * 프로젝트 구조 업데이트 스키마
    * NoSQL에 저장된 프로젝트 구조(layout)을 업데이트함`,
    tags: ["project", "update"],
    params: mlProjectOwnerModel,
    body: mlProjectLayoutModel,
    response: {
      201: {
        description: "Project structure updated",
        type: "object",
        properties: {
          result: { type: "boolean" },
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
  handler: async function (req, rep) {
    // console.log(req.params);
    // console.log(req.body.layout);
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.updateOne(
      {
        user_idx: Number(req.params.user_idx),
        proj_idx: Number(req.params.proj_idx),
      },
      {
        $set: {
          layout: req.body.layout,
        },
      }
    );
    console.log(result.acknowledged);
    return result.acknowledged; // true || false
  },
};

export default updateProject;
