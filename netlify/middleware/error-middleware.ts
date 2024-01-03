import { ResponseError } from "../error/response-error";
import { Request, Response, NextFunction } from "express"; 

const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
        next();
        return;
    }
    

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message
        }).end();
    } else {
        console.error(err);
        res.status(500).json({
            errors: "Internal Server Error"
        }).end();
    }
};

export {
    errorMiddleware
};
