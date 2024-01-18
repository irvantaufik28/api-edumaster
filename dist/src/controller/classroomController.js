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
const class_transformer_validator_1 = require("class-transformer-validator");
const create_or_update_classroom_dto_1 = require("../dto/create-or-update-classroom.dto");
const classroomService_1 = __importDefault(require("../service/classroomService"));
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            code: req.query.code,
            level: req.query.level,
            year_group: req.query.year_group,
            status: req.query.status,
            class_major_id: req.query.class_major_id,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const classroomService = new classroomService_1.default();
        const result = yield classroomService.get(request);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dataUser = req.user;
    console.log(dataUser);
    try {
        const classroomService = new classroomService_1.default();
        const result = yield classroomService.create(req.body);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const clasroomList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.prismaClient.classroom.findMany({
            where: {
                level: req.query.level,
                status: req.query.status
            },
            include: {
                classMajor: true
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "classroom not found!");
        }
        return res.status(200).json({ data: result });
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                classMajor: true
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "classroom not found!");
        }
        return res.status(200).json({ data: result });
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_classroom_dto_1.CreateOrUpdateClassroomDto, req.body, {
            validator: { skipMissingProperties: true }
        });
    }
    catch (e) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const result = yield database_1.prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "classroom not found!");
        }
        yield database_1.prismaClient.classroom.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: req.body,
        });
        return res.status(200).json({ message: "data successfully updated" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "classroom not found!");
        }
        yield database_1.prismaClient.classroom.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });
        return res.status(200).json({ message: "data successfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
const moveStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroomService = new classroomService_1.default();
        const id = parseInt(req.params.id);
        yield classroomService.moveStudent(req.body, id);
        return res.status(200).json({ message: "student succesfully moved" });
    }
    catch (error) {
        next(error);
    }
});
const deleteStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield database_1.prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.query.classroom_id)
            }
        });
        if (!classroom) {
            throw new response_error_1.ResponseError(404, "classroom not found!");
        }
        const student = yield database_1.prismaClient.student.findUnique({
            where: { id: req.query.student_id }
        });
        if (!student) {
            throw new response_error_1.ResponseError(404, "student not found!");
        }
        yield database_1.prismaClient.studentClassroom.delete({
            where: { student_id_classroom_id: { student_id: req.query.student_id, classroom_id: parseInt(req.query.classroom_id) } }
        });
        const studentClassrooms = yield database_1.prismaClient.student.findUnique({
            where: { id: req.query.student_id },
            include: {
                student_classrooms: true
            }
        });
        if (!(studentClassrooms === null || studentClassrooms === void 0 ? void 0 : studentClassrooms.student_classrooms.length)) {
            yield database_1.prismaClient.student.update({
                where: {
                    id: req.query.student_id
                },
                data: {
                    current_classroom_id: null
                }
            });
        }
        return res.status(200).json({ message: "data successfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    create,
    clasroomList,
    getById,
    update,
    deleted,
    moveStudent,
    deleteStudent
};
//# sourceMappingURL=classroomController.js.map