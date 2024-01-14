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
const class_transformer_validator_1 = require("class-transformer-validator");
const create_or_update_classmajor_dto_1 = require("../dto/create-or-update-classmajor.dto");
const response_error_1 = require("../error/response-error");
const classMajorService_1 = __importDefault(require("../service/classMajorService"));
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = new classMajorService_1.default();
        const result = yield service.get({
            name: req.query.name,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        });
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmajor = yield database_1.prismaClient.classMajor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!classmajor) {
            throw new response_error_1.ResponseError(404, "classmajor not found");
        }
        return res.status(200).json({
            data: classmajor
        });
    }
    catch (error) {
        next(error);
    }
});
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmajor = yield database_1.prismaClient.classMajor.findMany();
        return res.status(200).json({ data: classmajor });
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_classmajor_dto_1.CreateOrUpdateClassMajorDto, req.body);
    }
    catch (e) {
        return new response_error_1.ResponseError(400, e.toString());
    }
    try {
        const result = yield database_1.prismaClient.classMajor.create({
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
    try {
        yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_classmajor_dto_1.CreateOrUpdateClassMajorDto, req.body, {
            validator: { skipMissingProperties: true }
        });
    }
    catch (e) {
        return new response_error_1.ResponseError(400, e.toString());
    }
    try {
        const classmajor = yield database_1.prismaClient.classMajor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!classmajor) {
            throw new response_error_1.ResponseError(404, "classmajor not found");
        }
        const result = yield database_1.prismaClient.classMajor.update({
            data: req.body,
            where: ({
                id: parseInt(req.params.id)
            })
        });
        return res.status(200).json({ message: "classmajor successfuly updated" });
    }
    catch (error) {
        next(error);
    }
});
const deleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classmajor = yield database_1.prismaClient.classMajor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!classmajor) {
            throw new response_error_1.ResponseError(404, "classmajor not found");
        }
        yield database_1.prismaClient.classMajor.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(200).json({
            message: "classmajor successfully deleted"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    list,
    getById,
    create,
    update,
    deleted
};
//# sourceMappingURL=classMajorController.js.map