import { cloudinaryUpload } from "../config/cloudinary.config";


export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryUpload.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};
