import { mlProjectOwnerModel } from "../models/mlProject.model.js";
import { deleteAllModelInS3 } from "../utils/s3.js";

const deleteUserData = {
  schema: {
    description: `Delete projects
    * 탈퇴한 사용자의 모든 프로젝트 데이터 삭제 스키마
    * NoSQL에 저장된 사용자의 프로젝트 데이터 모두를 삭제함
    * 이와 함께 S3에 저장된 모델 데이터도 삭제함`,
    tags: ["project", "delete"],
    params: mlProjectOwnerModel,
    response: {
      201: {
        description: "Project deleted",
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
  handler: async function (req, rep) {
    const userIdx = Number(req.params.user_idx);

    // NoSQL DB의 데이터 삭제
    const collection = this.mongo.db.collection("ml_proj_structure");
    const nosqlResult = await collection.deleteMany({
      user_idx: Number(userIdx),
    });
    console.log(nosqlResult);
    if (nosqlResult.acknowledged) {
      const s3Result = await deleteAllModelInS3(userIdx, ""); // 사용자의 모델 데이터 삭제
      console.log(s3Result);
      rep.send(true);
    } else {
      rep.send(new Error("NoSQL error : Project deletion failed"));
      // throw new Error("NoSQL error : Project deletion failed");
    }
  },
};

export default deleteUserData;
