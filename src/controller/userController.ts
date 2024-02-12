import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const result = await prismaClient.user.findMany({
            where: {
                user_roles: {
                    some: {
                        role_id: 1, // Specify the role ID you want to filter
                    },
                },
            },
            include: {
                user_roles: {
                    include: { role: true }
                },
            },
        })

        return res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
};
const getById = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {


        const user = await prismaClient.user.findFirst({
            include: {
                StaffUser: {
                    include: {
                        staff: true
                    }
                },
                user_roles: {
                    include: {
                        role: true
                    }
                }
            },
            where: { id: req.user.id }
        })
        let roles: any = []
        const userRole = user?.user_roles.forEach(item => {
            roles.push(item.role.name)
        });


        return res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        const user = await prismaClient.user.findFirst({
            where: {
                id: req.user.id
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
                        student: {
                            include: {
                                student_classrooms: {
                                    include: {
                                        classroom: {
                                            include: {
                                                classMajor: true
                                            }
                                        }
                                    }
                                },
                                student_parents: true,
                            }
                        }
                    }
                }

            }
        })

        if (!user) {
            throw new ResponseError(404, "user not found")
        }

        let user_detail = user.StaffUser?.[0]?.staff ?? user.StudentUser?.[0]?.student ?? {};

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

        const user_data = {
            id: user.id,
            username: user.username,
            roles: roles,
            permissions: uniquePermissionsArray,
            user_detail,

        }

        return res.status(200).json({
            data: user_data

        });
    } catch (error) {
        next(error);
    }
}

export default {
    getProfile,
    get,
    getById
};
