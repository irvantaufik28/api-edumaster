import { Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import { sortSchedule } from '../application/common/common';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        const request = {
            classroom_id: req.query.classroom_id,
            day_name: req.query.day_name,
        }

        const filters: any = [];

        if (request.classroom_id) {
            filters.push({
                classroom_id: {
                    equals: parseInt(request.classroom_id),
                }
            })
        }
        if (request.day_name) {
            filters.push({
                day_name: {
                    contains: request.day_name,
                }
            })
        }


        const classroomSchedule = await prismaClient.classroomSchedule.findMany({
            where: {
                AND: filters
            },
            include: {
                teacher_course: {
                    include: {
                        staff: true
                    }
                },
                courses: true
            }
        })

        const result = classroomSchedule.sort(sortSchedule);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};






const getTeacherSchedule = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        const request = {
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);

        let orders = {
            [request.orderBy || 'day_name']: request.sortBy || 'desc',
        };

        const teacherSchedule = await prismaClient.classroomSchedule.findMany({
            orderBy: orders,
            where: {
                teacher_course: {
                    staff_id: req.params.teacher_id
                }
            },
            include: {
                classroom: {
                    include: {
                        classMajor: true
                    }
                },
                teacher_course: {
                    include: {
                        courses: true
                    }
                }
            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.classroomSchedule.count({
            where: {
                teacher_course: {
                    staff_id: req.params.teacher_id
                }
            }
        })

        const result = {
            data: teacherSchedule,
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
        const classroomSchedule = await prismaClient.classroomSchedule.findUnique({
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


        if (!classroomSchedule) {
            throw new ResponseError(404, "classroom schedule  not found")
        }

        return res.status(200).json({ data: classroomSchedule });
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
        const classroomSchedule = await prismaClient.classroomSchedule.create({
            data: req.body,
        });

        return res.status(200).json({ data: classroomSchedule });
    } catch (error: any) {
        next(error)
    }
};
const createMany = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }

    try {
        const timeTables = req.body.timeTables

        for (const time of timeTables) {
            await prismaClient.classroomSchedule.create({
                data: {
                    classroom_id: parseInt(req.body.classroom_id),
                    teacher_course_id: parseInt(req.body.teacher_course_id),
                    day_name: time.day_name.toUpperCase(),
                    start_time: time.start_time,
                    end_time: time.end_time
                },
            });

        }

        return res.status(200).json({ message: "classroom schedule successfully created" });
    } catch (error: any) {
        next(error)
    }
};

const createFromStructureCurriCulum = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const request = {
        classroom_id: parseInt(req.body.classroom_id),
        structure_curriculum_id: parseInt(req.body.structure_curriculum_id)
    }

    try {

        await prismaClient.$transaction(async (tx) => {

            const classroom = await tx.classroom.findUnique({
                where: {
                    id: request.classroom_id
                }
            })

            if (!classroom) {
                throw new ResponseError(404, "classroom not found")
            }

            const structureCurriculum = await tx.structureCurriculum.findUnique({
                where: {
                    id: request.structure_curriculum_id
                },
                include: {
                    classroom_schedule: true
                }
            })

            if (!structureCurriculum) {
                throw new ResponseError(404, "structure curriculum not found")
            }


            const classroomSchedules = structureCurriculum.classroom_schedule

            if (!classroomSchedules.length) {
                throw new ResponseError(400, "Structure Curriculem Don't have a schedule yet, please make one first")
            }

            for (const schedule of classroomSchedules) {
                await tx.classroomSchedule.create({
                    data: {
                        classroom_id: request.classroom_id,
                        course_id: schedule.course_id
                    }
                })
            }

        })


        return res.status(200).json({ message: "classroom Schedule successfuly created" });
    } catch (error: any) {
        next(error)
    }


}

const update = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    // try {
    //     await transformAndValidate("", req.body);
    // } catch (e: any) {
    //     return res.status(404).json({ message: e.toString() });
    // }

    try {

        const classroomSchedule = await prismaClient.classroomSchedule.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });


        if (!classroomSchedule) {
            throw new ResponseError(404, "course not found")
        }

        await prismaClient.classroomSchedule.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body,
        });

        return res.status(200).json({ message: "classroom Schedule course successfuly updated" });
    } catch (error: any) {
        next(error)
    }
};



const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const classroomSchedule = await prismaClient.classroomSchedule.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!classroomSchedule) {
            throw new ResponseError(404, "course not found")
        }

        await prismaClient.classroomSchedule.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.status(200).json({ message: "classroom Schedulesuccessfully deleted" });
    } catch (error: any) {
        next(error)
    }
};



export default {
    get,
    getById,
    getTeacherSchedule,
    createFromStructureCurriCulum,
    create,
    createMany,
    update,
    deleted
};
