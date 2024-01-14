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
const create_or_update_staffDto_1 = require("../dto/create-or-update-staffDto");
class StaffService {
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
                const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
                const skip = (parseInt(page) - 1) * parseInt(size);
                const filters = [];
                if (request.nik) {
                    filters.push({
                        nik: {
                            equals: request.nik,
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
                if (request.gender) {
                    filters.push({
                        status: {
                            gender: request.gender,
                        },
                    });
                }
                let include_course = false;
                if (request.role_id) {
                    filters.push({
                        staff_user: {
                            some: {
                                user: {
                                    user_roles: {
                                        some: {
                                            role_id: parseInt(request.role_id),
                                        },
                                    },
                                },
                            },
                        },
                    });
                    include_course = true;
                }
                if (request.course_id) {
                    filters.push({
                        teacher_course: {
                            some: {
                                courses: {
                                    id: parseInt(request.course_id),
                                },
                            },
                        },
                    });
                }
                let orders = {
                    [request.orderBy || "created_at"]: request.sortBy || "desc",
                };
                const staff = yield tx.staff.findMany({
                    orderBy: orders,
                    where: {
                        AND: filters,
                    },
                    include: {
                        teacher_course: {
                            include: {
                                courses: include_course,
                            },
                        },
                        staff_user: {
                            include: {
                                user: {
                                    include: {
                                        user_roles: {
                                            include: {
                                                role: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    take: parseInt(size),
                    skip: skip,
                });
                const totalItems = yield tx.staff.count({
                    where: {
                        AND: filters,
                    },
                });
                result = {
                    data: staff,
                    paging: {
                        page: page,
                        total_item: totalItems,
                        total_page: Math.ceil(totalItems / parseInt(size)),
                    },
                };
            }));
            return result;
        });
    }
    getStaffTeacher(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
                const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
                const skip = (parseInt(page) - 1) * parseInt(size);
                const filters = [];
                const teacher_role_id = yield tx.role.findUnique({
                    where: {
                        name: "teacher"
                    },
                    select: {
                        id: true
                    }
                });
                if (request.nik) {
                    filters.push({
                        nik: {
                            equals: request.nik,
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
                if (request.gender) {
                    filters.push({
                        status: {
                            gender: request.gender,
                        },
                    });
                }
                if (request.course_id) {
                    filters.push({
                        teacher_course: {
                            some: {
                                courses: {
                                    id: parseInt(request.course_id),
                                },
                            },
                        },
                    });
                }
                let orders = {
                    [request.orderBy || "created_at"]: request.sortBy || "desc",
                };
                const staff = yield tx.staff.findMany({
                    orderBy: orders,
                    where: {
                        AND: filters,
                        staff_user: {
                            some: {
                                user: {
                                    user_roles: {
                                        some: {
                                            role_id: teacher_role_id === null || teacher_role_id === void 0 ? void 0 : teacher_role_id.id
                                        }
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        teacher_course: {
                            include: {
                                courses: true,
                            },
                        },
                        staff_user: {
                            include: {
                                user: {
                                    include: {
                                        user_roles: {
                                            include: {
                                                role: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    take: parseInt(size),
                    skip: skip,
                });
                const totalItems = yield tx.staff.count({
                    where: {
                        AND: filters,
                    },
                });
                result = {
                    data: staff,
                    paging: {
                        page: page,
                        total_item: totalItems,
                        total_page: Math.ceil(totalItems / parseInt(size)),
                    },
                };
            }));
            return result;
        });
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_staffDto_1.CreateOrUpdateStaffDto, request);
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, e.toString());
            }
            let result;
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const staff = yield tx.staff.create({
                    data: {
                        nik: request.nik,
                        first_name: request.first_name,
                        middle_name: request.middle_name,
                        last_name: request.last_name,
                        birth_date: request.birth_date,
                        birth_place: request.birth_place,
                        gender: request.gender,
                        foto_url: request.foto_url,
                        religion: request.religion,
                        phone: request.phone,
                        email: request.email,
                        address: request.address,
                        status: "active",
                    },
                    select: {
                        id: true,
                    },
                });
                const defaultPassword = (0, common_1.generateDefaultPassword)(request.birth_date);
                const username = (0, common_1.generateStaffUsername)(request.birth_date, request.first_name);
                const user_data = {
                    username: username,
                    password: yield bcrypt_1.default.hash(defaultPassword, 10),
                };
                const user = yield tx.user.create({
                    data: user_data,
                    select: {
                        id: true,
                    },
                });
                yield tx.staffUser.create({
                    data: {
                        staff_id: staff.id,
                        user_id: user.id,
                    },
                });
                const staff_roles = request.roles;
                for (const data of staff_roles) {
                    yield tx.userRoles.create({
                        data: {
                            user_id: user.id,
                            role_id: data.role_id,
                        },
                    });
                }
                result = yield tx.staff.findFirst({
                    where: {
                        id: staff.id,
                    },
                    include: {
                        staff_user: {
                            include: {
                                staff: true,
                                user: {
                                    include: {
                                        user_roles: true,
                                    },
                                },
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
                yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_staffDto_1.CreateOrUpdateStaffDto, request, {
                    validator: { skipMissingProperties: true },
                });
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, e.toString());
            }
            let result;
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const staff = yield tx.staff.findUnique({
                    where: {
                        id: id,
                    },
                });
                if (!staff) {
                    throw new response_error_1.ResponseError(404, "staff not found");
                }
                yield tx.staff.update({
                    where: {
                        id: id,
                    },
                    data: {
                        nik: request.nik,
                        first_name: request.first_name,
                        middle_name: request.middle_name,
                        last_name: request.last_name,
                        birth_date: request.birth_date,
                        birth_place: request.birth_place,
                        gender: request.gender,
                        foto_url: request.foto_url,
                        religion: request.religion,
                        phone: request.phone,
                        email: request.email,
                        address: request.address,
                        status: request.status,
                    },
                });
                result = yield tx.staff.findFirst({
                    where: {
                        id: staff.id,
                    },
                });
            }));
            return result;
        });
    }
}
exports.default = StaffService;
//# sourceMappingURL=staffService.js.map