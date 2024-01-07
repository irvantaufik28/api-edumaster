import { Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';

const getById = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {


        const rolePermission = await prismaClient.rolePermission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!rolePermission) {
            throw new ResponseError(404, "role permission not found")
        }


        return res.status(200).json({ data: rolePermission });
    } catch (error) {
        next(error);
    }
};
const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    // try {
    //     await transformAndValidate('', req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }

    const request = {
        role_id : parseInt(req.body.role_id),
        permission_id: parseInt(req.body.permission_id)
    }

    try {
        const rolePermission = await prismaClient.rolePermission.create({
            data: {
                role_id: request.role_id,
                permission_id: request.permission_id
            },
        });

        return res.status(200).json({ data: rolePermission });
    } catch (error: any) {
        next(error)
    }
};

export default {
    getById,
    create
}