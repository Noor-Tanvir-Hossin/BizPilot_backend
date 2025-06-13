import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
    cloud_name: config.cloudinary_cloude_name, 
    api_key: config.cloudinary_api_key, 
    api_secret: config.cloudinary_api_secret,
    timeout: 60000, 
})

const uploadToCloudinary = async(fileuri: string) =>{
    try {
     const uploadResult = await cloudinary.uploader
     .upload(fileuri)
     return uploadResult
    } catch (error) {
        console.log(error);
        throw new Error("Failed to upload image to Cloudinary")
        
    }
}

// export const cloudinaryFunc ={
//     uploadCloudinary, cloudinary
// }

export {uploadToCloudinary, cloudinary}