import { v2 as cloudinary } from "cloudinary";
import  multer from "multer";
import * as path from "path";
import * as fs from "fs";

const dirPath = "./public";
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        cb(null, path.join(__dirname, "../../public"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const fileFIlter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "application/pdf" || // PDF
        file.mimetype === "application/msword" || // Word
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // Word (docx)
        file.mimetype === "application/vnd.ms-excel" || // Excel
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Excel (xlsx)
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer ({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFIlter
})


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})



async function uploadCloudinary(filePath : any, folder : any){

    if(folder == undefined) {
        folder = 'other'
    }
    let result
    try {
        result = await cloudinary.uploader.upload(filePath, {
            use_filename: true,
            folder
        })
        fs.unlinkSync(filePath)
        return result.url
    } catch (error) {
        fs.unlinkSync(filePath)
        return null
    }
}

export {
    uploadCloudinary,
    upload
}


