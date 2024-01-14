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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = require("./application/logging");
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const error_middleware_1 = require("./middleware/error-middleware");
const redis_1 = require("redis");
const REDIS_PORT = parseInt((_a = process.env.REDIS_PORT) !== null && _a !== void 0 ? _a : '6379', 10);
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: "localhost",
        port: REDIS_PORT
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    redisClient.on('error', (err) => {
        console.log('Redis Client Error', err);
    });
    redisClient.on('ready', () => console.log('Redis is ready'));
    yield redisClient.connect();
    yield redisClient.ping();
}))();
const api = (0, express_1.default)();
api.use((0, cors_1.default)({
    origin: "*",
}));
api.use(express_1.default.json());
api.use(express_1.default.urlencoded({ extended: true }));
api.use("/api/v1", api_1.default);
api.use(error_middleware_1.errorMiddleware);
const PORT = process.env.PORT || 4000;
api.listen(PORT, () => {
    logging_1.logger.info(`App start at ${process.env.HOST}:${process.env.PORT}`);
});
//# sourceMappingURL=main.js.map