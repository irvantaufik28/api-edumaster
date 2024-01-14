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
            year_group: req.query.year_group,
            level: req.query.level,
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
        if (request.year_group) {
            filters.push({
                type: {
                    contains: request.year_group,
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
        let orders = {
            [request.orderBy || "created_at"]: request.sortBy || "desc",
        };
        const structureCurriculum = yield database_1.prismaClient.structureCurriculum.findMany({
            orderBy: orders,
            where: {
                AND: filters
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = yield database_1.prismaClient.structureCurriculum.count({
            where: {
                AND: filters
            }
        });
        const result = {
            data: structureCurriculum,
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
        const structureCurriculum = yield database_1.prismaClient.structureCurriculum.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                classroom_schedule: {
                    include: {
                        courses: true
                    }
                }
            }
        });
        structureCurriculum === null || structureCurriculum === void 0 ? void 0 : structureCurriculum.classroom_schedule.sort((a, b) => {
            var _a, _b;
            const nameA = (_a = a.courses) === null || _a === void 0 ? void 0 : _a.name.toUpperCase();
            const nameB = (_b = b.courses) === null || _b === void 0 ? void 0 : _b.name.toUpperCase();
            if (nameA && nameB) {
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
            }
            return 0;
        });
        if (!structureCurriculum) {
            throw new response_error_1.ResponseError(404, "structure curriculum not found");
        }
        return res.status(200).json({ data: structureCurriculum });
    }
    catch (error) {
        next(error);
    }
});
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structureCurriculum = yield database_1.prismaClient.structureCurriculum.findMany();
        return res.status(200).json({ data: structureCurriculum });
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
        const result = yield database_1.prismaClient.structureCurriculum.create({
            data: req.body
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
        const structureCurriculum = yield database_1.prismaClient.structureCurriculum.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!structureCurriculum) {
            throw new response_error_1.ResponseError(404, "structure curriculum not found");
        }
        yield database_1.prismaClient.structureCurriculum.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });
        return res.status(200).json({ message: "structure curriculum successfuly updated" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structureCurriculum = yield database_1.prismaClient.structureCurriculum.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!structureCurriculum) {
            throw new response_error_1.ResponseError(404, "structure curriculum not found");
        }
        yield database_1.prismaClient.structureCurriculum.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(200).json({ message: "structure curriculum successfully deleted" });
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
//# sourceMappingURL=structureCurriculumController.js.map