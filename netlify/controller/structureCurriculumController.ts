import { Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateOrUpdateRoleDto } from '../dto/create-or-update-role.dto';
import { ResponseError } from '../error/response-error';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        const request = {
            page: req.query.page,
            size: req.query.size,
            name: req.query.name,
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


        const structureCurriculum = await prismaClient.structureCurriculum.findMany({
            where: {
                AND: filters
            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.structureCurriculum.count({
            where: {
                AND: filters
            }
        })

        const result = {
            data: structureCurriculum,
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




const getById = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const structureCurriculum = await prismaClient.structureCurriculum.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                classroom_schedule : {
                    include: {
                        courses: true
                    }
                }
            }
        });


        if (!structureCurriculum) {
            throw new ResponseError(404, "structure curriculum not found")
        }

        return res.status(200).json({ data: structureCurriculum });
    } catch (error: any) {
        next(error)
    }
};

const list = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const structureCurriculum = await prismaClient.structureCurriculum.findMany();



        return res.status(200).json({ data: structureCurriculum });
    } catch (error: any) {
        next(error)
    }
};


const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }

    try {
        const result = await prismaClient.structureCurriculum.create({
            data: req.body
        });

        return res.status(200).json(result);
    } catch (error: any) {
        next(error)
    }
};

const update = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }

    try {

        const structureCurriculum = await prismaClient.structureCurriculum.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });


        if (!structureCurriculum) {
            throw new ResponseError(404, "structure curriculum not found")
        }

         await prismaClient.structureCurriculum.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });

        return res.status(200).json({ message: "structure curriculum successfuly updated" });
    } catch (error: any) {
        next(error)
    }
};



const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const structureCurriculum = await prismaClient.structureCurriculum.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!structureCurriculum) {
            throw new ResponseError(404, "structure curriculum not found")
        }

        await prismaClient.structureCurriculum.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.status(200).json({ message: "structure curriculum successfully deleted" });
    } catch (error: any) {
        next(error)
    }
};



export default {
    get,
    getById,
    list,
    create,
    update,
    deleted
};
