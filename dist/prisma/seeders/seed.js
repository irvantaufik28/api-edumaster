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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield prisma.role.createMany({
            data: [
                {
                    id: 1,
                    name: 'administrator'
                },
                {
                    id: 2,
                    name: 'student',
                }
            ]
        });
        const staffAdmin = yield prisma.staff.create({
            data: {
                id: (0, uuid_1.v4)(),
                nik: '3205050708940000',
                first_name: "Cindy",
                last_name: "Mutiara",
                middle_name: "Sidik",
                birth_date: "1994-08-09",
                birth_place: "Garut",
                gender: "female",
                phone: "082315156666",
                email: "cindy@gmail.com",
                address: "Jl. Cimanuk no 110 Garut",
                foto_url: "http://res.cloudinary.com/dnvltueqb/image/upload/v1702991363/staff_foto/1702991361966_download_dzrfrw.png",
                religion: "islam",
                status: "active"
            },
        });
        const user = yield prisma.user.create({
            data: {
                id: (0, uuid_1.v4)(),
                username: 'super_admin',
                password: yield bcrypt_1.default.hash('password', 10)
            },
        });
        const user_has_staff = yield prisma.staffUser.create({
            data: {
                staff_id: staffAdmin.id,
                user_id: user.id
            }
        });
        const admin_has_role = yield prisma.userRoles.create({
            data: {
                user_id: user.id,
                role_id: 1
            }
        });
        console.log({ role, user, admin_has_role, user_has_staff });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map