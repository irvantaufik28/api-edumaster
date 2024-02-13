import { Response, NextFunction } from 'express';
import { prismaClient } from '../../application/database';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const request = {
            page: req.query.page,
            size: req.query.size,
            name: req.query.name,
            not_in_role: req.query.not_in_role,
            semester: req.query.semester,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

    
      
        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters: any = [];


        if (request.name) {
            filters.push({
                name: {
                    contains: request.name,
                    mode: 'insensitive'
                }
            })
        }
       
        if (request.not_in_role) {
            filters.push({
                role_permission: {
                    none : {
                        role_id: parseInt(request.not_in_role)
                    }
                }
            })
        }

        let orders = {
            [request.orderBy || "id"]: request.sortBy || "asc",
        };


        const permission = await prismaClient.permission.findMany({
            orderBy: orders,
            where: {
                AND: filters,  
                
            },
            take: parseInt(size),
            skip: skip,
          
        })     
        const totalItems = await prismaClient.permission.count({
            where: {
                AND: filters
            }
        })
    
        const result = {
            data: permission,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size))
            }
        }

        return res.status(200).json(result);


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
        const result = await prismaClient.permission.create({
            data: req.body,
        });

        return res.status(200).json(result);
    } catch (error: any) {
        next(error)
    }
};

export default  {
    get,
    create
}