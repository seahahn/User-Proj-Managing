import { mlProjectOwnerModel, mlProjectsModel } from "../models/mlProject.model.js";

const getProjList = {
  schema: {
    description: `Return project list for the user
    * 사용자의 프로젝트 목록 불러오기 스키마
    * 사용자 고유 번호를 이용하여 SQL DB에 저장된 프로젝트 목록을 불러옴
    * {idx, user_idx, proj_name} 형태의 원소로 구성된 배열을 반환함`,
    tags: ["project", "load"],
    params: mlProjectOwnerModel,
    response: {
      200: mlProjectsModel,
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
    await this.pg.query("SELECT idx, user_idx, proj_name FROM ml_project WHERE user_idx=$1", [Number(req.params.user_idx)], (err, result) => {
      console.log(err || result.rows);
      rep.send(err || result.rows);
    });
  },
};

export default getProjList;
