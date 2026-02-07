import bluebird from "bluebird";
import AWS from "aws-sdk";

const { AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_BUCKET_REGION, AWS_BUCKET_NAME } = process.env;
AWS.config.setPromisesDependency(bluebird);
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION,
});

const s3 = new AWS.S3();

const uploadBase64Image = async (base64String: string, key: string) => {
  const base64Data = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""), "base64");

  // Getting the file type, ie: jpeg, png or gif
  const type = base64String.split(";")[0].split("/")[1];

  const params = {
    Bucket: AWS_BUCKET_NAME!,
    Key: `${key}.${type}`, // type is not required
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  return await s3.upload(params).promise();
};

const uploadFile = async (file: Express.Multer.File, key: string) => {
  const type = file.mimetype.split("/")[1];

  const params = {
    Bucket: AWS_BUCKET_NAME!,
    Key: `${key}.${type}`, // type is not required
    Body: file.buffer,
    ContentEncoding: "buffer",
    ContentType: file.mimetype,
  };

  return await s3.upload(params).promise();
};

function getFileStream(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: AWS_BUCKET_NAME!,
  };

  return s3.getObject(downloadParams).createReadStream();
}

export default {
  uploadBase64Image,
  getFileStream,
  uploadFile,
};
