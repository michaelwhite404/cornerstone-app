import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";

const { AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_BUCKET_REGION, AWS_BUCKET_NAME } = process.env;

const s3Client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY!,
    secretAccessKey: AWS_SECRET_KEY!,
  },
});

const uploadBase64Image = async (base64String: string, key: string) => {
  const base64Data = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""), "base64");

  // Getting the file type, ie: jpeg, png or gif
  const type = base64String.split(";")[0].split("/")[1];

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: AWS_BUCKET_NAME!,
      Key: `${key}.${type}`,
      Body: base64Data,
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    },
  });

  return await upload.done();
};

const uploadFile = async (file: Express.Multer.File, key: string) => {
  const type = file.mimetype.split("/")[1];

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: AWS_BUCKET_NAME!,
      Key: `${key}.${type}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  return await upload.done();
};

function getFileStream(fileKey: string): Readable {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME!,
    Key: fileKey,
  });

  // Return a passthrough stream that we'll pipe the S3 response into
  const { PassThrough } = require("stream");
  const stream = new PassThrough();

  s3Client
    .send(command)
    .then((response) => {
      if (response.Body instanceof Readable) {
        response.Body.pipe(stream);
      } else {
        stream.emit("error", new Error("Unexpected response body type"));
      }
    })
    .catch((err) => {
      stream.emit("error", err);
    });

  return stream;
}

export default {
  uploadBase64Image,
  getFileStream,
  uploadFile,
};
