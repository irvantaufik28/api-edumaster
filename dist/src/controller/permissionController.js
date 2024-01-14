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
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = {
            page: req.query.page,
            size: req.query.size,
            name: req.query.name,
            not_in_role: req.query.not_in_role,
            semester: req.query.semester,
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
        if (request.not_in_role) {
            filters.push({
                role_permission: {
                    none: {
                        role_id: parseInt(request.not_in_role)
                    }
                }
            });
        }
        let orders = {
            [request.orderBy || "id"]: request.sortBy || "asc",
        };
        const permission = yield database_1.prismaClient.permission.findMany({
            orderBy: orders,
            where: {
                AND: filters,
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = yield database_1.prismaClient.permission.count({
            where: {
                AND: filters
            }
        });
        const result = {
            data: permission,
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
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     await transformAndValidate('', req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }
    try {
        const result = yield database_1.prismaClient.permission.create({
            data: req.body,
        });
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    create
};
//# sourceMappingURL=permissionController.js.map