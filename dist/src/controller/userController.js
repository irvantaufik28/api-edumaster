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
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.prismaClient.user.findMany({
            where: {
                user_roles: {
                    some: {
                        role_id: 1, // Specify the role ID you want to filter
                    },
                },
            },
            include: {
                user_roles: {
                    include: { role: true }
                },
            },
        });
        return res.status(200).json({
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.prismaClient.user.findFirst({
            include: {
                StaffUser: {
                    include: {
                        staff: true
                    }
                },
                user_roles: {
                    include: { role: true
                    }
                }
            },
            where: { id: req.user.id }
        });
        let roles = [];
        const userRole = user === null || user === void 0 ? void 0 : user.user_roles.forEach(item => {
            roles.push(item.role.name);
        });
        return res.status(200).json({
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getById
};
//# sourceMappingURL=userController.js.map