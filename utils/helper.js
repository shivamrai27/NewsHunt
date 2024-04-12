import { supportedMimes } from "../config/filesystem.js";
import { v4 as uuidv4 } from "uuid";
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

export const generateRandomNumber = () => {
    return uuidv4();
}