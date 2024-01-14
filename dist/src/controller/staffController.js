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
const staffService_1 = __importDefault(require("../service/staffService"));
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffService = new staffService_1.default();
        const request = {
            first_name: req.query.first_name,
            middle_name: req.query.middle_name,
            last_name: req.query.last_name,
            gender: req.query.gender,
            status: req.query.status,
            nik: req.query.nik,
            course_id: req.query.course_id,
            page: req.query.page,
            size: req.query.size,
            role_id: req.query.role_id,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const staffs = yield staffService.get(request);
        return res.status(200).json(staffs);
    }
    catch (error) {
        next(error);
    }
});
const getTeacher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffService = new staffService_1.default();
        const request = {
            first_name: req.query.first_name,
            middle_name: req.query.middle_name,
            last_name: req.query.last_name,
            gender: req.query.gender,
            status: req.query.status,
            nik: req.query.nik,
            course_id: req.query.course_id,
            page: req.query.page,
            size: req.query.size,
            role_id: req.query.role_id,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const staffs = yield staffService.getStaffTeacher(request);
        return res.status(200).json(staffs);
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield database_1.prismaClient.staff.findUnique({
            where: { id: req.params.id },
            include: {
                teacher_course: {
                    include: {
                        courses: true
                    }
                },
                staff_user: {
                    include: {
                        user: {
                            include: {
                                user_roles: {
                                    include: {
                                        role: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!staff) {
            throw new response_error_1.ResponseError(404, "staff not found");
        }
        return res.status(200).json(staff);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffService = new staffService_1.default();
        const staff = yield staffService.create(req.body);
        return res.status(200).json(staff);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffService = new staffService_1.default();
        const staff = yield staffService.update(req.body, req.params.id);
        return res.status(200).json(staff);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getTeacher,
    getById,
    create,
    update
};
//# sourceMappingURL=staffController.js.map