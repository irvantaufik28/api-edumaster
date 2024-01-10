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


    try {
        await prismaClient.$transaction(async (tx) => {

            const permissions = req.body.permissions
            if (!permissions.length) {
                throw new ResponseError(400, "please insert permission")
            }

            for (const data of permissions) {

                const role = await tx.role.findUnique({
                    where: {
                        id: data.role_id
                    }
                })

                if (!role) {
                    throw new ResponseError(404, "role not found")
                }

                const permission = await tx.permission.findUnique({
                    where: {
                        id: data.permission_id
                    }
                })

                if (!permission) {
                    throw new ResponseError(404, "permission not found")
                }


                await tx.rolePermission.create({
                    data: {
                        role_id: parseInt(data.role_id),
                        permission_id: parseInt(data.permission_id)
                    },
                });
            }
        })


        return res.status(200).json({ message: "permissions has successfuly added" });
    } catch (error: any) {
        next(error)
    }
};


const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {


        const rolePermission = await prismaClient.rolePermission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!rolePermission) {
            throw new ResponseError(404, "role permission not found")
        }

        await prismaClient.rolePermission.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })


        return res.status(200).json({ message: "role permission successfuly deleted" });
    } catch (error) {
        next(error);
    }
};

export default {
    getById,
    create,
    deleted
}