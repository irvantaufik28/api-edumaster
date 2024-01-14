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
const class_transformer_validator_1 = require("class-transformer-validator");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const common_1 = require("../application/common/common");
const create_or_update_student_dto_1 = require("../dto/create-or-update-student.dto");
class StudentService {
    constructor() { }
    get(request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (parseInt(page) - 1) * parseInt(size);
            const filters = [];
            if (request.nis) {
                filters.push({
                    nis: {
                        contains: request.nis,
                    },
                });
            }
            if (request.first_name) {
                filters.push({
                    first_name: {
                        contains: request.first_name,
                        mode: "insensitive",
                    },
                });
            }
            if (request.middle_name) {
                filters.push({
                    middle_name: {
                        contains: request.middle_name,
                        mode: "insensitive",
                    },
                });
            }
            if (request.last_name) {
                filters.push({
                    last_name: {
                        contains: request.last_name,
                        mode: "insensitive",
                    },
                });
            }
            if (request.status) {
                filters.push({
                    status: {
                        equals: request.status,
                    },
                });
            }
            if (request.register_year) {
                filters.push({
                    register_year: {
                        equals: request.register_year,
                    },
                });
            }
            if (request.current_classroom_id) {
                filters.push({
                    current_classroom_id: {
                        equals: parseInt(request.current_classroom_id),
                    },
                });
            }
            if (request.not_in_classroom_id) {
                filters.push({
                    student_classrooms: {
                        none: {
                            classroom_id: parseInt(request.not_in_classroom_id),
                        },
                    },
                });
            }
            if (request.in_classroom_id) {
                filters.push({
                    student_classrooms: {
                        some: {
                            classroom_id: parseInt(request.in_classroom_id),
                        },
                    },
                });
            }
            let orders = {
                [request.orderBy || "created_at"]: request.sortBy || "desc",
            };
            const students = yield database_1.prismaClient.student.findMany({
                orderBy: orders,
                where: {
                    AND: filters,
                },
                include: {
                    student_classrooms: {
                        include: {
                            classroom: true,
                        },
                    },
                },
                take: parseInt(size),
                skip: skip,
            });
            const totalItems = yield database_1.prismaClient.student.count({
                where: {
                    AND: filters,
                },
            });
            return {
                data: students,
                paging: {
                    page: page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_student_dto_1.createOrUpdateStudentDto, request);
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, e.toString());
            }
            let result;
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const student = yield tx.student.create({
                    data: {
                        nis: (0, common_1.generateNIS)(new Date().getFullYear()),
                        first_name: request.first_name,
                        middle_name: request.middle_name,
                        last_name: request.last_name,
                        birth_date: request.birth_date,
                        birth_place: request.birth_place,
                        birth_certificate_no: request.birth_certificate_no,
                        family_identity_no: request.family_identity_no,
                        origin_academy: request.origin_academy,
                        religion: request.religion,
                        gender: request.gender,
                        status: "preparation",
                        register_year: request.register_year,
                        foto_url: request.foto_url,
                    },
                    select: {
                        id: true,
                        nis: true,
                    },
                });
                const student_parents = request.student_parents;
                for (const data of student_parents) {
                    yield tx.studentParent.create({
                        data: {
                            nik: data.nik,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            relationship: data.relationship,
                            phone: data.phone,
                            email: data.email,
                            job: data.job,
                            salary: data.salary,
                            address: data.address,
                            student_id: student.id,
                        },
                        select: {
                            id: true,
                        },
                    });
                }
                const defaultPassword = (0, common_1.generateDefaultPassword)(request.birth_date);
                const user_data = {
                    username: student.nis,
                    password: yield bcrypt_1.default.hash(defaultPassword, 10),
                };
                const user = yield tx.user.create({
                    data: user_data,
                    select: {
                        id: true,
                    },
                });
                const student_role = yield tx.role.findFirst({
                    where: {
                        name: "student",
                    },
                    select: {
                        id: true,
                    },
                });
                if (!student_role) {
                    const create_studentRole = yield tx.role.create({
                        data: {
                            name: "student"
                        }
                    });
                    yield tx.userRoles.create({
                        data: {
                            user_id: user.id,
                            role_id: create_studentRole.id,
                        },
                    });
                }
                else {
                    yield tx.userRoles.create({
                        data: {
                            user_id: user.id,
                            role_id: student_role.id,
                        },
                    });
                }
                yield tx.studentUser.create({
                    data: {
                        user_id: user.id,
                        student_id: student.id,
                    },
                });
                result = yield tx.student.findFirst({
                    where: {
                        id: student.id,
                    },
                    include: {
                        student_parents: true,
                        student_user: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
            }));
            return result;
        });
    }
    update(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_student_dto_1.createOrUpdateStudentDto, request, {
                    validator: {
                        skipMissingProperties: true,
                    },
                });
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, e.toString());
            }
            let result;
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const student = yield tx.student.update({
                    where: {
                        id: id,
                    },
                    data: {
                        first_name: request.first_name,
                        middle_name: request.middle_name,
                        last_name: request.last_name,
                        birth_date: request.birth_date,
                        birth_place: request.birth_place,
                        birth_certificate_no: request.birth_certificate_no,
                        family_identity_no: request.family_identity_no,
                        origin_academy: request.origin_academy,
                        religion: request.religion,
                        gender: request.gender,
                        status: request.status,
                        register_year: request.register_year,
                        foto_url: request.foto_url,
                    },
                    select: {
                        id: true,
                        nis: true,
                    },
                });
                const parentsUpdateDataIds = request.student_parents
                    .filter((o) => o.id)
                    .map((o) => o.id);
                const existStudentParents = yield tx.studentParent.findMany({
                    where: {
                        student_id: id,
                        id: {
                            notIn: parentsUpdateDataIds,
                        },
                    },
                    select: {
                        id: true,
                    },
                });
                const deleteParentIds = existStudentParents
                    .filter((o) => o.id)
                    .map((o) => o.id);
                if (existStudentParents.length > 0) {
                    yield tx.studentParent.deleteMany({
                        where: {
                            id: {
                                in: deleteParentIds,
                            },
                        },
                    });
                }
                for (const data of request.student_parents) {
                    if (data.id) {
                        yield tx.studentParent.update({
                            where: {
                                id: data.id,
                            },
                            data: {
                                nik: data.nik,
                                first_name: data.first_name,
                                last_name: data.last_name,
                                relationship: data.relationship,
                                phone: data.phone,
                                email: data.email,
                                job: data.job,
                                salary: data.salary,
                                address: data.address,
                                student_id: student.id,
                            },
                            select: {
                                id: true,
                            },
                        });
                    }
                    else {
                        yield tx.studentParent.create({
                            data: {
                                nik: data.nik,
                                first_name: data.first_name,
                                last_name: data.last_name,
                                relationship: data.relationship,
                                phone: data.phone,
                                email: data.email,
                                job: data.job,
                                salary: data.salary,
                                address: data.address,
                                student_id: student.id,
                            },
                        });
                    }
                }
                result = yield tx.student.findFirst({
                    where: {
                        id: student.id,
                    },
                    include: {
                        student_parents: true,
                        student_user: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
            }));
            return result;
        });
    }
}
exports.default = StudentService;
//# sourceMappingURL=studentService.js.map