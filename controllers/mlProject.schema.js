import { saveProject, loadProject, loadProjects, updateProject, deleteProject, deleteAllProjects } from "./mlProject.controller.js";
import { mlProjectModel, mlProjectsModel, mlProjectOwnerModel, mlProjectLayoutModel } from "../models/mlProject.model.js";

// 1개 프로젝트 로드 스키마
const loadProjectSchema = {
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
    handler: loadProject,
};

// 프로젝트 리스트 로드 스키마
const loadProjectsSchema = {
    schema: {
        description: "Load All project structures for Admin",
        tags: ["project", "load", "admin"],
        response: {
            200: mlProjectsModel,
        },
    },
    handler: loadProjects,
};

// 1개 프로젝트 저장 스키마
const saveProjectSchema = {
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
    handler: saveProject,
};

const updateProjectSchema = {
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
    handler: updateProject,
};

const deleteProjectSchema = {
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
    handler: deleteProject,
};

const deleteAllProjectsSchema = {
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
    handler: deleteAllProjects,
};

export { loadProjectSchema, loadProjectsSchema, saveProjectSchema, updateProjectSchema, deleteProjectSchema, deleteAllProjectsSchema };
