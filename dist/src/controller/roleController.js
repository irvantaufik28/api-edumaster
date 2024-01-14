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
const class_transformer_validator_1 = require("class-transformer-validator");
const create_or_update_role_dto_1 = require("../dto/create-or-update-role.dto");
const response_error_1 = require("../error/response-error");
const create_or_delete_userRolse_dto_1 = require("../dto/create-or-delete-userRolse.dto");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = {
            page: req.query.page,
            size: req.query.size,
            name: req.query.name,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
        const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters = [];
        if (request.name) {
            filters.push({
                name: {
                    contains: request.name,
                    mode: 'insensitive'
                }
            });
        }
        const roles = yield database_1.prismaClient.role.findMany({
            where: {
                AND: filters
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = yield database_1.prismaClient.role.count({
            where: {
                AND: filters
            }
        });
        const result = {
            data: roles,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size))
            }
        };
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield database_1.prismaClient.role.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                role_permission: {
                    include: {
                        permission: true
                    }
                }
            }
        });
        if (!role) {
            throw new response_error_1.ResponseError(404, "Role not found");
        }
        return res.status(200).json({ data: role });
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_role_dto_1.CreateOrUpdateRoleDto, req.body);
    }
    catch (e) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const result = yield database_1.prismaClient.role.create({
            data: req.body,
            select: {
                id: true,
                name: true
            }
        });
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const createUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        user_id: req.body.user_id,
        role_id: req.body.role_id
    };
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_delete_userRolse_dto_1.CreateOrDeleteUserRolesDto, request);
    }
    catch (e) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const existUserRole = yield database_1.prismaClient.userRoles.findUnique({
            where: {
                user_id_role_id: {
                    user_id: request.user_id, role_id: request.role_id
                }
            }
        });
        if (existUserRole) {
            throw new response_error_1.ResponseError(400, "user has already have this role");
        }
        const result = yield database_1.prismaClient.userRoles.create({
            data: {
                user_id: req.body.user_id,
                role_id: req.body.role_id
            }
        });
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const deleteUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        user_id: req.query.user_id,
        role_id: parseInt(req.query.role_id)
    };
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_delete_userRolse_dto_1.CreateOrDeleteUserRolesDto, request);
    }
    catch (e) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const countUserRole = yield database_1.prismaClient.userRoles.count({
            where: {
                user_id: request.user_id
            }
        });
        if (countUserRole <= 1) {
            throw new response_error_1.ResponseError(400, "can't delete user must have role minimun 1");
        }
        const UserRole = yield database_1.prismaClient.userRoles.findUnique({
            where: {
                user_id_role_id: {
                    user_id: request.user_id, role_id: request.role_id
                }
            }
        });
        if (!UserRole) {
            throw new response_error_1.ResponseError(400, "user role not found");
        }
        yield database_1.prismaClient.userRoles.delete({
            where: {
                user_id_role_id: {
                    user_id: request.user_id, role_id: request.role_id
                }
            }
        });
        return res.status(200).json(({ message: 'user role successfuly deleted' }));
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getById,
    create,
    createUserRole,
    deleteUserRole
};
//# sourceMappingURL=roleController.js.map