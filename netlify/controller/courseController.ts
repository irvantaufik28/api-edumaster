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
            type: req.query.type,
            level: req.query.level,
            not_in_curriculum: req.query.not_in_curriculum,
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
        if (request.type) {
            filters.push({
                type: {
                    contains: request.type,
                }
            })
        }

        if (request.semester) {
            filters.push({
                semester: {
                    contains: request.semester,
                }
            })
        }

        if (request.level) {
            filters.push({
                level: {
                    contains: request.level,
                }
            })
        }

        if (request.not_in_curriculum) {
            filters.push({
                classroom_schedule: {
                    none: {
                        structure_curriculum_id: parseInt(request.not_in_curriculum)
                    }
                }
            })
        }

        let orders = {
            [request.orderBy || "created_at"]: request.sortBy || "desc",
        };


        const course = await prismaClient.course.findMany({
            orderBy: orders,
            where: {
                AND: filters,
            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.course.count({
            where: {
                AND: filters
            }
        })

        const result = {
            data: course,
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
        const course = await prismaClient.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                teacher_course: {
                    include: {
                        staff: true
                    }
                }

            }
        });


        if (!course) {
            throw new ResponseError(404, "course not found")
        }

        return res.status(200).json({ data: course });
    } catch (error: any) {
        next(error)
    }
};

const list = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const course = await prismaClient.course.findMany();



        return res.status(200).json({ data: course });
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
        const result = await prismaClient.course.create({
            data: req.body,
            select: {
                id: true,
                name: true
            }
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

        const course = await prismaClient.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });


        if (!course) {
            throw new ResponseError(404, "course not found")
        }

        const result = await prismaClient.course.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });

        return res.status(200).json({ message: "course successfuly updated" });
    } catch (error: any) {
        next(error)
    }
};



const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const course = await prismaClient.course.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!course) {
            throw new ResponseError(404, "course not found")
        }

        await prismaClient.course.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.status(200).json({ message: "course successfully deleted" });
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
