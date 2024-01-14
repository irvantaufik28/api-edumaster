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
const common_1 = require("../application/common/common");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            classroom_id: req.query.classroom_id,
            day_name: req.query.day_name,
        };
        const filters = [];
        if (request.classroom_id) {
            filters.push({
                classroom_id: {
                    equals: parseInt(request.classroom_id),
                }
            });
        }
        if (request.day_name) {
            filters.push({
                day_name: {
                    contains: request.day_name,
                }
            });
        }
        const classroomSchedule = yield database_1.prismaClient.classroomSchedule.findMany({
            where: {
                AND: filters
            },
            include: {
                teacher_course: {
                    include: {
                        staff: true,
                    },
                },
                courses: true
            },
        });
        const result = classroomSchedule.sort(common_1.sortSchedule);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getTeacherSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = {
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
        const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        let orders = {
            [request.orderBy || 'day_name']: request.sortBy || 'asc',
        };
        const teacherSchedule = yield database_1.prismaClient.classroomSchedule.findMany({
            orderBy: orders,
            where: {
                teacher_course: {
                    staff_id: req.params.teacher_id
                }
            },
            include: {
                classroom: {
                    include: {
                        classMajor: true
                    }
                },
                teacher_course: {
                    include: {
                        courses: true
                    }
                }
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = yield database_1.prismaClient.classroomSchedule.count({
            where: {
                teacher_course: {
                    staff_id: req.params.teacher_id
                }
            }
        });
        const result = {
            data: teacherSchedule,
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
        const classroomSchedule = yield database_1.prismaClient.classroomSchedule.findUnique({
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
        if (!classroomSchedule) {
            throw new response_error_1.ResponseError(404, "classroom schedule  not found");
        }
        return res.status(200).json({ data: classroomSchedule });
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
        const classroomSchedule = yield database_1.prismaClient.classroomSchedule.create({
            data: req.body,
        });
        return res.status(200).json({ data: classroomSchedule });
    }
    catch (error) {
        next(error);
    }
});
const createMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }
    try {
        const timeTables = req.body.timeTables;
        for (const time of timeTables) {
            yield database_1.prismaClient.classroomSchedule.create({
                data: {
                    classroom_id: parseInt(req.body.classroom_id),
                    teacher_course_id: parseInt(req.body.teacher_course_id),
                    course_id: parseInt(req.body.course_id),
                    day_name: time.day_name.toUpperCase(),
                    start_time: time.start_time,
                    end_time: time.end_time
                },
            });
        }
        return res.status(200).json({ message: "classroom schedule successfully created" });
    }
    catch (error) {
        next(error);
    }
});
const createFromStructureCurriCulum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        classroom_id: parseInt(req.body.classroom_id),
        structure_curriculum_id: parseInt(req.body.structure_curriculum_id)
    };
    try {
        yield database_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const classroom = yield tx.classroom.findUnique({
                where: {
                    id: request.classroom_id
                }
            });
            if (!classroom) {
                throw new response_error_1.ResponseError(404, "classroom not found");
            }
            const structureCurriculum = yield tx.structureCurriculum.findUnique({
                where: {
                    id: request.structure_curriculum_id
                },
                include: {
                    classroom_schedule: true
                }
            });
            if (!structureCurriculum) {
                throw new response_error_1.ResponseError(404, "structure curriculum not found");
            }
            const classroomSchedules = structureCurriculum.classroom_schedule;
            if (!classroomSchedules.length) {
                throw new response_error_1.ResponseError(400, "Structure Curriculem Don't have a schedule yet, please make one first");
            }
            for (const schedule of classroomSchedules) {
                const meetPerWeek = schedule.meet_per_week || 1;
                for (let i = 0; i < meetPerWeek; i++) {
                    yield tx.classroomSchedule.create({
                        data: {
                            classroom_id: request.classroom_id,
                            course_id: schedule.course_id
                        }
                    });
                }
            }
        }));
        return res.status(200).json({ message: "classroom Schedule successfuly created" });
    }
    catch (error) {
        next(error);
    }
});
const createScheduleStructureCurriCulum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req.body.timeTables;
    try {
        yield database_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const timeTables = request;
            for (const data of timeTables) {
                const course = yield tx.course.findUnique({
                    where: {
                        id: data.course_id
                    }
                });
                if (!course) {
                    throw new response_error_1.ResponseError(404, `course with id ${data.course_id} not found`);
                }
                const structureCurriculum = yield tx.structureCurriculum.findUnique({
                    where: {
                        id: data.structure_curriculum_id
                    },
                });
                if (!structureCurriculum) {
                    throw new response_error_1.ResponseError(404, `structure curriculum  with id ${data.structure_curriculum_id}not found`);
                }
                yield tx.classroomSchedule.create({
                    data: {
                        course_id: data.course_id,
                        meet_per_week: data.meet_per_week,
                        structure_curriculum_id: data.structure_curriculum_id
                    }
                });
            }
        }));
        return res.status(200).json({ message: "classroom Schedule for curriculum successfuly created" });
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
        const classroomSchedule = yield database_1.prismaClient.classroomSchedule.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!classroomSchedule) {
            throw new response_error_1.ResponseError(404, "course not found");
        }
        yield database_1.prismaClient.classroomSchedule.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });
        return res.status(200).json({ message: "classroom Schedule course successfuly updated" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroomSchedule = yield database_1.prismaClient.classroomSchedule.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!classroomSchedule) {
            throw new response_error_1.ResponseError(404, "course not found");
        }
        yield database_1.prismaClient.classroomSchedule.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(200).json({ message: "classroom Schedulesuccessfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getById,
    getTeacherSchedule,
    createFromStructureCurriCulum,
    createScheduleStructureCurriCulum,
    create,
    createMany,
    update,
    deleted
};
//# sourceMappingURL=classroomScheduleController.js.map