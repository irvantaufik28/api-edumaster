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
            course_id: req.query.course_id,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters: any = [];

        if (request.course_id) {
            filters.push({
                course_id: {
                    equals: parseInt(request.course_id),

                }
            })
        }


        const teacherCourse = await prismaClient.teacherCourse.findMany({
            where: {
                AND: filters
            },
            include: {
                staff: true,
                courses: true
            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.teacherCourse.count({
            where: {
                AND: filters
            }
        })

        const result = {
            data: teacherCourse,
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
        const course = await prismaClient.teacherCourse.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                staff: true,
                courses: true,
                classroom_schedule: true
            }
        });


        if (!course) {
            throw new ResponseError(404, "teacher Courses course not found")
        }

        return res.status(200).json({ data: course });
    } catch (error: any) {
        next(error)
    }
};

const getByStaffId = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const course = await prismaClient.teacherCourse.findMany({
            where: {
                staff_id: req.params.id
            },
            include: {
                courses: true,
            }
        });

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

        const staff = await prismaClient.staff.findUnique({
            where: {
                id: req.body.staff_id
            }
        })

        if (!staff) {
            throw new ResponseError(404, "staff not found")
        }

        const course = await prismaClient.course.findUnique({
            where: {
                id: parseInt(req.body.course_id)
            }
        })

        if (!course) {
            throw new ResponseError(404, "course not found")
        }
        const result = await prismaClient.teacherCourse.create({
            data: req.body,
        });

        return res.status(200).json({ data: result });
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


        const staff = await prismaClient.staff.findUnique({
            where: {
                id: req.body.staff_id
            }
        })

        if (!staff) {
            throw new ResponseError(404, "staff not found")
        }

        const course = await prismaClient.course.findUnique({
            where: {
                id: parseInt(req.body.course_id)
            }
        })


        if (!course) {
            throw new ResponseError(404, "teacher course not found")
        }

        await prismaClient.teacherCourse.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });

        return res.status(200).json({ message: "teacher course successfuly updated" });
    } catch (error: any) {
        next(error)
    }
};



const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const course = await prismaClient.teacherCourse.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!course) {
            throw new ResponseError(404, "teacher course not found")
        }

        await prismaClient.teacherCourse.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.status(200).json({ message: "teacher course successfully deleted" });
    } catch (error: any) {
        next(error)
    }
};



export default {
    get,
    getById,
    getByStaffId,
    create,
    update,
    deleted
};
