import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

//configuration

cloudinary.config({
    cloud_name:envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key:envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret:envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})


   // Upload an image
export const cloudinaryUpload=cloudinary