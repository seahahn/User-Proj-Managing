import { getModelListInS3, organizedModelList } from "../utils/s3.js";

export const sendModelList = (fastify, userIdx, reply) => {
    fastify.pg.query("SELECT idx, user_idx, model_name FROM ml_model WHERE user_idx=$1", [userIdx], async (err, result) => {
        const s3Contents = await getModelListInS3(userIdx);
        reply.send(err || organizedModelList(userIdx, result.rows, s3Contents));
        console.log(organizedModelList(userIdx, result.rows, s3Contents));
    });
};
