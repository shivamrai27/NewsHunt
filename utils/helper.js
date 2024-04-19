import { supportedMimes } from "../config/filesystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
export const imageValidator = (size, mime) => {
    if (bytesToMb(size) > 2) {
        return "image size must be less than 2 MB";
    }
    else if (!supportedMimes.includes(mime)) {
        return "image type not supported";
    }

    return null;
};

export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024)
}

export const generateRandomNum = () => {
    return uuidv4();
}
export const getImageUrl = (imgName) => {
    return `${process.env.APP_URL}/images/${imgName}`;
}

export const removeImage = (imageName) => {
    const path = process.cwd + "/public/images/" + imageName;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// * upLoad images (This function is used to upload img in DB)
export const uploadImage = (image) => {
    const imgExt = image?.name.split(".");
    const imageName = generateRandomNum() + "." + imgExt[1];
    // * where(path) you want to save the image after renaming it
    const uploadPath = process.cwd() + "/public/images/" + imageName;
    // * moving the profile pic to uploadPath
    image.mv(uploadPath, (err) => {
        if (err) throw err;
    });
    return imageName;
}