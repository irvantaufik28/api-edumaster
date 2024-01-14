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
            course_id: req.query.course_id,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
        const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters = [];
        if (request.course_id) {
            filters.push({
                course_id: {
                    equals: parseInt(request.course_id),
                }
            });
        }
        const teacherCourse = yield database_1.prismaClient.teacherCourse.findMany({
            where: {
                AND: filters
            },
            include: {
                staff: true,
                courses: true
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = yield database_1.prismaClient.teacherCourse.count({
            where: {
                AND: filters
            }
        });
        const result = {
            data: teacherCourse,
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
        const course = yield database_1.prismaClient.teacherCourse.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                staff: true,
                courses: true,
                classroom_schedule: true
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "teacher Courses course not found");
        }
        return res.status(200).json({ data: course });
    }
    catch (error) {
        next(error);
    }
});
const getByStaffId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield database_1.prismaClient.teacherCourse.findMany({
            where: {
                staff_id: req.params.id
            },
            include: {
                courses: true,
            }
        });
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
        const staff = yield database_1.prismaClient.staff.findUnique({
            where: {
                id: req.body.staff_id
            }
        });
        if (!staff) {
            throw new response_error_1.ResponseError(404, "staff not found");
        }
        const course = yield database_1.prismaClient.course.findUnique({
            where: {
                id: parseInt(req.body.course_id)
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "course not found");
        }
        const result = yield database_1.prismaClient.teacherCourse.create({
            data: req.body,
        });
        return res.status(200).json({ data: result });
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
        const staff = yield database_1.prismaClient.staff.findUnique({
            where: {
                id: req.body.staff_id
            }
        });
        if (!staff) {
            throw new response_error_1.ResponseError(404, "staff not found");
        }
        const course = yield database_1.prismaClient.course.findUnique({
            where: {
                id: parseInt(req.body.course_id)
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "teacher course not found");
        }
        yield database_1.prismaClient.teacherCourse.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });
        return res.status(200).json({ message: "teacher course successfuly updated" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield database_1.prismaClient.teacherCourse.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!course) {
            throw new response_error_1.ResponseError(404, "teacher course not found");
        }
        yield database_1.prismaClient.teacherCourse.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(200).json({ message: "teacher course successfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getById,
    getByStaffId,
    create,
    update,
    deleted
};
//# sourceMappingURL=teacherCourseController.js.map