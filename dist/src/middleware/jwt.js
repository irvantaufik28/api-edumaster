"use strict";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_error_1 = require("../error/response-error");
const database_1 = require("../application/database");
dotenv_1.default.config();
const getToken = (authHeader) => {
    const splitHeader = authHeader.split(' ');
    return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
};
const authorized = (authorization) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!authorization || typeof authorization !== 'string') {
            return null;
        }
        const token = getToken(authorization);
        const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield database_1.prismaClient.user.findUnique({
            where: {
                id: payload.id
            },
        });
        if (!user) {
            return null;
        }
        const user_data = {
            id: payload.id,
            username: payload.username,
            permissions: payload.permissions
        };
        return user_data;
    }
    catch (err) {
        return null;
    }
});
const allowedPermission = (allowedPermission) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    try {
        const user = yield authorized(authorization);
        if (!user || !allowedPermission.some(permission => user.permissions.includes(permission))) {
            throw new response_error_1.ResponseError(400, "Unauthorized, you not have permission");
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
const allowedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    try {
        const user = yield authorized(authorization);
        console.log(user);
        console.log(user);
        console.log(user);
        console.log(user);
        console.log(user);
        console.log(user);
        if (!user) {
            throw new response_error_1.ResponseError(400, "Unauthorized");
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = { allowedPermission, allowedUser };
//# sourceMappingURL=jwt.js.map