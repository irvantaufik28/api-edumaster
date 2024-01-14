import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";

dotenv.config();

const getToken = (authHeader: string) => {
    const splitHeader = authHeader.split(' ');
    return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
}

const authorized = async (authorization: string | undefined) => {
    try {

        if (!authorization || typeof authorization !== 'string') {
            return null;
        }

        const token = getToken(authorization);
        const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
        const payload: any = jwt.verify(token, secretKey);

        const user = await prismaClient.user.findUnique({
            where: {
                id: payload.id
            },
        })
        if (!user) {
            return null
        }
        const user_data = {
            id: payload.id,
            username: payload.username,
            permissions: payload.permissions
        };

        return user_data;
    } catch (err) {
        return null;
    }
};

const allowedPermission = (allowedPermission: string[]) => async (req: any, res: any, next: any) => {
    const { authorization } = req.headers;
    try {
        const user = await authorized(authorization);
        if (!user || !allowedPermission.some(permission => user.permissions.includes(permission))) {
            throw new ResponseError(400, "Unauthorized, you not have permission");
        }
        req.user = user;
        next()
    } catch (error) {
        next(error);
    }
}

const allowedUser =  async (req: any, res: any, next: any) => {
    const { authorization } = req.headers;
    try {
        const user = await authorized(authorization);
       if (!user) {
        throw new ResponseError(400, "Unauthorized")
       }
        req.user = user;
        next()
    } catch (error) {
        next(error);
    }
}




export default { allowedPermission, allowedUser };
