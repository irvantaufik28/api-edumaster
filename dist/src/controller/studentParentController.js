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
const class_transformer_validator_1 = require("class-transformer-validator");
const create_or_update_studentParent_Dto_1 = require("../dto/create-or-update-studentParent.Dto");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            first_name: req.query.first_name,
            last_name: req.query.last_name,
            nik: req.query.nik,
            student_id: req.query.student_id,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = yield database_1.prismaClient.studentParent.findMany();
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_studentParent_Dto_1.CreateOrUpdateStudentParentDto, req.body);
    }
    catch (e) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const student = yield database_1.prismaClient.student.findUnique({
            where: {
                id: req.body.student_id
            }
        });
        if (!student) {
            throw new response_error_1.ResponseError(404, "student not found!");
        }
        const result = yield database_1.prismaClient.studentParent.create({
            data: req.body
        });
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.prismaClient.studentParent.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                student: true
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "student parent not found!");
        }
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_studentParent_Dto_1.CreateOrUpdateStudentParentDto, req.body, {
            validator: { skipMissingProperties: true }
        });
    }
    catch (e) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const result = yield database_1.prismaClient.studentParent.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "classroom not found!");
        }
        yield database_1.prismaClient.studentParent.update({
            where: {
                id: req.params.id,
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
        const result = yield database_1.prismaClient.studentParent.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!result) {
            throw new response_error_1.ResponseError(404, "student parent not found!");
        }
        yield database_1.prismaClient.studentParent.delete({
            where: {
                id: req.params.id,
            },
        });
        return res.status(200).json({ message: "data successfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getById,
    update,
    create,
    deleted
};
//# sourceMappingURL=studentParentController.js.map