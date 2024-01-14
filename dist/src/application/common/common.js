"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortSchedule = exports.generateAccessToken = exports.generateDefaultPassword = exports.generateStaffUsername = exports.generateNIS = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateNIS = (currentYear) => {
    currentYear.toString().slice(-4);
    const randomFourDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const randomNumber = currentYear + randomFourDigits;
    return randomNumber;
};
exports.generateNIS = generateNIS;
const generateAccessToken = (data) => {
    const user_data = {
        id: data.id,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
        user_detail: data.user_detail
    };
    const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
    const accessToken = jsonwebtoken_1.default.sign(user_data, secretKey, { expiresIn: '6h' });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const generateStaffUsername = (birth_date, first_name) => {
    const parts = birth_date.split('-');
    const twoLastDigits = parts[0].slice(-2);
    const result = first_name + twoLastDigits + parts[1] + parts[2];
    return result;
};
exports.generateStaffUsername = generateStaffUsername;
const generateDefaultPassword = (birth_date) => {
    const parts = birth_date.split('-');
    const twoLastDigits = parts[0].slice(-2);
    const result = twoLastDigits + parts[1] + parts[2];
    return result;
};
exports.generateDefaultPassword = generateDefaultPassword;
const sortSchedule = (scheduleA, scheduleB) => {
    const daysOrder = {
        "SUNDAY": 0,
        "MONDAY": 1,
        "TUESDAY": 2,
        "WEDNESDAY": 3,
        "THURSDAY": 4,
        "FRIDAY": 5,
        "SATURDAY": 6
    };
    const dayOrderA = daysOrder[scheduleA.day_name];
    const dayOrderB = daysOrder[scheduleB.day_name];
    if (dayOrderA !== undefined || dayOrderA !== null && dayOrderB !== undefined || dayOrderB !== null) {
        if (dayOrderA !== dayOrderB) {
            return dayOrderA - dayOrderB;
        }
        const startTimeA = new Date(`1970-01-01T${scheduleA.start_time}`);
        const startTimeB = new Date(`1970-01-01T${scheduleB.start_time}`);
        return startTimeA.getTime() - startTimeB.getTime();
    }
    return 0;
};
exports.sortSchedule = sortSchedule;
//# sourceMappingURL=common.js.map