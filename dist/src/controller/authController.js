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
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const common_1 = require("../application/common/common");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const user = yield database_1.prismaClient.user.findFirst({
            where: {
                username: req.body.username
            },
            include: {
                user_roles: {
                    include: {
                        role: {
                            include: {
                                role_permission: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                },
                StaffUser: {
                    include: {
                        staff: true
                    }
                },
                StudentUser: {
                    include: {
                        student: true
                    }
                }
            }
        });
        if (!user) {
            throw new response_error_1.ResponseError(404, "username or passwod wrong!");
        }
        const verifyPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!verifyPassword) {
            throw new response_error_1.ResponseError(404, "username or passwod wrong!");
        }
        let user_detail = (_d = (_b = (_a = user.StaffUser) === null || _a === void 0 ? void 0 : _a[0].staff) !== null && _b !== void 0 ? _b : (_c = user.StudentUser) === null || _c === void 0 ? void 0 : _c[0].student) !== null && _d !== void 0 ? _d : {};
        const roles = (user === null || user === void 0 ? void 0 : user.user_roles.map(item => item.role.name)) || [];
        let permissionsData = new Set();
        for (const roles of user === null || user === void 0 ? void 0 : user.user_roles) {
            for (const permissions of roles.role.role_permission) {
                const permissionName = (_e = permissions.permission) === null || _e === void 0 ? void 0 : _e.name;
                if (permissionName && !permissionsData.has(permissionName)) {
                    permissionsData.add(permissionName);
                }
            }
        }
        const uniquePermissionsArray = Array.from(permissionsData);
        const user_data_token = {
            id: user.id,
            username: user.username,
            roles: roles,
            permissions: uniquePermissionsArray,
            user_detail: user_detail
        };
        const token = (0, common_1.generateAccessToken)(user_data_token);
        const user_data = {
            id: user.id,
            username: user.username,
            roles: roles,
            permissions: uniquePermissionsArray,
            user_detail,
            token: token,
        };
        return res.status(200).json({
            data: user_data
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    login
};
//# sourceMappingURL=authController.js.map