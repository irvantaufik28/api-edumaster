"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}
exports.ResponseError = ResponseError;
//# sourceMappingURL=response-error.js.map