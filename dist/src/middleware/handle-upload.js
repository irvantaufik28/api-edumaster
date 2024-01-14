"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// const dirPath = "./public";
// if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath);
// }
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const fileFIlter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
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
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFIlter
});
exports.upload = upload;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
function uploadCloudinary(filePath, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        if (folder == undefined) {
            folder = 'other';
        }
        let result;
        try {
            result = yield cloudinary_1.v2.uploader.upload(filePath, {
                use_filename: true,
                folder
            });
            fs.unlinkSync(filePath);
            return result.url;
        }
        catch (error) {
            fs.unlinkSync(filePath);
            return null;
        }
    });
}
exports.uploadCloudinary = uploadCloudinary;
//# sourceMappingURL=handle-upload.js.map