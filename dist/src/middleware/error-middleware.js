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
exports.errorMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const errorMiddleware = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!err) {
        next();
        return;
    }
    if (err instanceof response_error_1.ResponseError) {
        res.status(err.status).json({
            errors: err.message
        }).end();
    }
    else {
        console.error(err);
        res.status(500).json({
            errors: "Internal Server Error",
            detail: err.message
        }).end();
    }
});
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error-middleware.js.map