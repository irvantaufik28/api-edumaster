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
                        staff:true
                    }
                },
                user_roles: {
                    include: { role: true
                 }    
                }
            },
            where: { id: req.user.id }
        })
        let roles : any = []
        const userRole = user?.user_roles.forEach(item => {
           roles.push( item.role.name)
        });

       
        return res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export default {
    get,
    getById
};
