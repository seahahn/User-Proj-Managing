import AWS from "aws-sdk";

const S3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
const BUCKET_NAME = "aiplay-test-bucket";
export const KEY_PREFIX = "model/";
export const S3_OBJECT_URL = `https://${BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${KEY_PREFIX}`;

export const getModelListInS3 = async (userIdx) => {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: KEY_PREFIX + userIdx,
  };
  const data = await S3.listObjects(params).promise();
  // console.log(data);
  return data.Contents;
};

export const copyModelInS3 = async (userIdx, oldModelName, newModelName) => {
  const params = {
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${KEY_PREFIX}${userIdx}/${oldModelName}`,
    Key: KEY_PREFIX + userIdx + "/" + newModelName,
  };
  const data = await S3.copyObject(params).promise();
  // console.log(data);
  return data;
};

export const deleteModelInS3 = async (userIdx, modelName) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: KEY_PREFIX + userIdx + "/" + modelName,
  };
  const data = await S3.deleteObject(params).promise();
  // console.log(data);
  return data;
};

// DB 데이터와 S3 객체의 size를 합친 사용자 ML 모델 목록을 반환
export const organizedModelList = (userIdx, array, contents) => {
  return array
    .map((row) => {
      const s3Content = contents.find((content) => content.Key === `${KEY_PREFIX}${userIdx}/${row.model_name}`);
      return {
        ...row,
        size: s3Content ? s3Content.Size : 0,
      };
    })
    .sort((a, b) => (a.model_name.toLowerCase() < b.model_name.toLowerCase() ? -1 : 1));
};
