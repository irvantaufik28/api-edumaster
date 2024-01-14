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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const permissionsData = [
            'all_access',
            'create_classroom',
            'update_classroom',
            'delete_classroom',
            'move_student',
            'delete_student_classroom',
            'create_classmajor',
            'update_classmajor',
            'delete_classmajor',
            'create_role',
            'create_user_role',
            'delete_user_role',
            'create_permission',
            'create_role_permission',
            'delete_role_permission',
            'create_student',
            'update_student',
            'create_student_parent',
            'update_student_parent',
            'delete_student_parent',
            'create_staff',
            'update_staff',
            'create_course',
            'update_course',
            'delete_course',
            'create_teacher_course',
            'update_teacher_course',
            'delete_teacher_course',
            'create_classroom_schedule',
            'update_classroom_schedule',
            'delete_classroom_schedule',
            'create_structure_curriculum',
            'update_structure_curriculum',
            'delete_structure_curriculum',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
            'dummy_',
        ];
        const createdPermissions = yield Promise.all(permissionsData.map((permissionName) => __awaiter(this, void 0, void 0, function* () {
            return prisma.permission.create({
                data: {
                    name: permissionName,
                },
            });
        })));
        console.log({ createdPermissions });
    });
}
main()
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
}))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed-permission.js.map