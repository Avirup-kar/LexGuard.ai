import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config';

const connectCloudinary = async () => {
  const config = {
    cloud_name: process.env.CLOUDINARY_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_SECRET_KEY?.trim(),
  };

  console.log("--- Cloudinary Config Sync ---");
  console.log("Cloud Name:", config.cloud_name);
  console.log("API Key:", config.api_key);
  console.log("Secret Length:", config.api_secret?.length);

  cloudinary.config(config);
};

export default connectCloudinary;