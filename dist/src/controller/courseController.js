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
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = {
            page: req.query.page,
            size: req.query.size,
            name: req.query.name,
            type: req.query.type,
            level: req.query.level,
            not_in_curriculum: req.query.not_in_curriculum,
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
        if (request.type) {
            filters.push({
                type: {
                    contains: request.type,
                }
            });
        }
        if (request.semester) {
            filters.push({
                semester: {
                    contains: request.semester,
                }
            });
        }
        if (request.level) {
            filters.push({
                level: {
                    contains: request.level,
                }
            });
        }
        if (request.not_in_curriculum) {
            filters.push({
                classroom_schedule: {
                    none: {
                        structure_curriculum_id: parseInt(request.not_in_curriculum)
                    }
                }
            });
        }
        let orders = {
            [request.orderBy || "created_at"]: request.sortBy || "desc",
        };
        const course = yield database_1.prismaClient.course.findMany({
            orderBy: orders,
            where: {
                AND: filters,
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = yield database_1.prismaClient.course.count({
            where: {
                AND: filters
            }
        });
        const result = {
            data: course,
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
        const course = yield database_1.prismaClient.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                teacher_course: {
                    include: {
                        staff: true
                    }
                }
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "course not found");
        }
        return res.status(200).json({ data: course });
    }
    catch (error) {
        next(error);
    }
});
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield database_1.prismaClient.course.findMany();
        return res.status(200).json({ data: course });
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }
    try {
        const result = yield database_1.prismaClient.course.create({
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
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }
    try {
        const course = yield database_1.prismaClient.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "course not found");
        }
        const result = yield database_1.prismaClient.course.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });
        return res.status(200).json({ message: "course successfuly updated" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield database_1.prismaClient.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "course not found");
        }
        yield database_1.prismaClient.course.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(200).json({ message: "course successfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getById,
    list,
    create,
    update,
    deleted
};
//# sourceMappingURL=courseController.js.map