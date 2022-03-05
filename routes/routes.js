import {
    loadProjectSchema,
    loadProjectsSchema,
    saveProjectSchema,
    updateProjectSchema,
    deleteProjectSchema,
    deleteAllProjectsSchema,
} from "../controllers/mlProject.schema.js";

const routes = async (fastify, options) => {
    // console.log("routes.js in");
    fastify.get("/", async (request, reply) => {
        return { hello: "fastify" };
    });

    fastify.get("/project", loadProjectsSchema);
    fastify.get("/project/:user_idx/:proj_idx", loadProjectSchema);
    fastify.post("/project", saveProjectSchema);
    fastify.put("/project/:user_idx/:proj_idx", updateProjectSchema);
    fastify.delete("/project/:user_idx/:proj_idx", deleteProjectSchema);
    fastify.delete("/project", deleteAllProjectsSchema);
};

export default routes;
