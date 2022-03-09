import { mlProjectModel, mlProjectsModel, mlProjectOwnerModel, mlProjectLayoutModel } from "../models/projStructure.model.js";

// 1개 프로젝트 로드 스키마
const loadProject = {
  schema: {
    description: "Load project structure",
    tags: ["project", "load"],
    params: mlProjectOwnerModel,
    response: {
      200: mlProjectModel,
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
    const user_idx = Number(req.params.user_idx);
    const proj_idx = Number(req.params.proj_idx);
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.findOne({
      user_idx: user_idx,
      proj_idx: proj_idx,
    });
    if (!result) {
      throw new Error("Invalid value");
    }
    // 프로젝트 최종 수정 시점 최신화
    // this.pg.transact(async (client) => {
    //   client.query("UPDATE ml_project SET last_update=NOW() WHERE idx=$1", [proj_idx]);
    //   // return result;
    // });
    return result;
  },
};

// 프로젝트 리스트 로드 스키마
const loadProjects = {
  schema: {
    description: "Load All project structures for Admin",
    tags: ["project", "load", "admin"],
    response: {
      200: mlProjectsModel,
    },
  },
  handler: async function (req, rep) {
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error("No documents found");
    }
    return result;
  },
};

// 1개 프로젝트 저장 스키마
const saveProject = {
  schema: {
    description: "Save project structure",
    tags: ["project", "save"],
    body: mlProjectModel,
    response: {
      201: {
        description: "Project structure saved",
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
    const collection = this.mongo.db.collection("ml_proj_structure");
    // console.log(req);
    const { user_idx, proj_idx, layout } = req.body;
    const result = await collection.insertOne({
      user_idx: user_idx,
      proj_idx: proj_idx,
      layout: layout,
    });
    return result;
  },
};

const updateProject = {
  schema: {
    description: "Update project structure",
    tags: ["project", "update"],
    params: mlProjectOwnerModel,
    body: mlProjectLayoutModel,
    response: {
      201: {
        description: "Project structure updated",
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
    return result;
  },
};

const deleteProject = {
  schema: {
    description: "Delete project structure",
    tags: ["project", "delete"],
    params: mlProjectOwnerModel,
    response: {
      201: {
        description: "Project structure deleted",
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
    // console.log(req.params);
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.deleteOne({
      user_idx: Number(req.params.user_idx),
      proj_idx: Number(req.params.proj_idx),
    });
    return result;
  },
};

const deleteAllProjects = {
  schema: {
    description: "Delete all project structures",
    tags: ["project", "delete", "admin"],
    response: {
      201: {
        description: "All project structures deleted",
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
  handler: async function deleteAllProjects(req, rep) {
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.deleteMany({});
    return result;
  },
};

export { loadProject, loadProjects, saveProject, updateProject, deleteProject, deleteAllProjects };
