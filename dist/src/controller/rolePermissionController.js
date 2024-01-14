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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rolePermission = yield database_1.prismaClient.rolePermission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!rolePermission) {
            throw new response_error_1.ResponseError(404, "role permission not found");
        }
        return res.status(200).json({ data: rolePermission });
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     await transformAndValidate('', req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }
    try {
        yield database_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const permissions = req.body.permissions;
            console.log(permissions);
            if (!permissions.length) {
                throw new response_error_1.ResponseError(400, "please insert permission");
            }
            for (const data of permissions) {
                const role = yield tx.role.findUnique({
                    where: {
                        id: data.role_id
                    }
                });
                if (!role) {
                    throw new response_error_1.ResponseError(404, "role not found");
                }
                const permission = yield tx.permission.findUnique({
                    where: {
                        id: data.permission_id
                    }
                });
                if (!permission) {
                    throw new response_error_1.ResponseError(404, "permission not found");
                }
                yield tx.rolePermission.create({
                    data: {
                        role_id: parseInt(data.role_id),
                        permission_id: parseInt(data.permission_id)
                    },
                });
            }
        }));
        return res.status(200).json({ message: "permissions has successfuly added" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rolePermission = yield database_1.prismaClient.rolePermission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!rolePermission) {
            throw new response_error_1.ResponseError(404, "role permission not found");
        }
        yield database_1.prismaClient.rolePermission.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(200).json({ message: "role permission successfuly deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getById,
    create,
    deleted
};
//# sourceMappingURL=rolePermissionController.js.map