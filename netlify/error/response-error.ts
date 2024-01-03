class ResponseError extends Error {
    public status: any;  
    constructor(status: any, message: any) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}

export {
    ResponseError
};
