import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import bcrypt from "bcrypt"
import { generateAccessToken } from '../application/common/common';

const login = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                username: req.body.username
            },
            include: {
                user_roles: {
                    include: {
                        role: {
                            include: {
                                role_permission: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }

                    }
                },
                StaffUser: {
                    include: {
                        staff: true
                    }
                },
                StudentUser: {
                    include: {
                        student: true
                    }
                }

            }
        })

        if (!user) {
            throw new ResponseError(404, "username or passwod wrong!")
        }

        const verifyPassword = await bcrypt.compare(req.body.password, user.password)
        if (!verifyPassword) {
            throw new ResponseError(404, "username or passwod wrong!")

        }

        let user_detail = user.StaffUser?.[0].staff ?? user.StudentUser?.[0].student ?? {};
       
        const roles: string[] = user?.user_roles.map(item => item.role.name) || [];
        let permissionsData: Set<string> = new Set();

        for (const roles of user?.user_roles) {
            for (const permissions of roles.role.role_permission) {
                const permissionName = permissions.permission?.name;
                if (permissionName && !permissionsData.has(permissionName)) {
                    permissionsData.add(permissionName);
                }
            }
        }
        const uniquePermissionsArray: string[] = Array.from(permissionsData);

        const user_data_token = {
            id: user.id,
            username: user.username,
            roles: roles,
            permissions: uniquePermissionsArray,
            user_detail: user_detail
        }

        const token = generateAccessToken(user_data_token)

        const user_data = {
            id: user.id,
            username: user.username,
            roles: roles,
            permissions: uniquePermissionsArray,
            user_detail,
            token: token,

        }

        return res.status(200).json({
            data: user_data

        });
    } catch (error) {
        next(error);
    }
};

export default {
    login
}