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
// import { ResponseError } from '../error/response-error';
const studentService_1 = __importDefault(require("../service/studentService"));
const response_error_1 = require("../error/response-error");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentService = new studentService_1.default();
        const request = {
            first_name: req.query.first_name,
            middle_name: req.query.middle_name,
            last_name: req.query.last_name,
            gender: req.query.gender,
            status: req.query.status,
            current_classroom_id: req.query.current_classroom_id,
            register_year: req.query.register_year,
            not_in_classroom_id: req.query.not_in_classroom_id,
            in_classroom_id: req.query.in_classroom_id,
            nis: req.query.nis,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = yield studentService.get(request);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.prismaClient.student.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                student_parents: true,
                student_user: {
                    include: {
                        user: true
                    }
                },
                student_classrooms: {
                    include: {
                        classroom: {
                            include: {
                                classMajor: true
                            }
                        }
                    }
                }
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, 'student not found');
        }
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentService = new studentService_1.default();
        const result = yield studentService.create(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentService = new studentService_1.default();
        const result = yield studentService.update(req.body, req.params.id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    create,
    update,
    getById
};
//# sourceMappingURL=studentController.js.map