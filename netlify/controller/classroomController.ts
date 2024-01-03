import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateOrUpdateClassroomDto } from '../dto/create-or-update-classroom.dto';
import ClassroomService from '../service/classroomService';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const request = {
            code: req.query.code,
            level: req.query.level,
            year_group: req.query.year_group,
            status: req.query.status,
            class_major_id: req.query.class_major_id,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

        const classroomService = new ClassroomService()
        const result = await classroomService.get(request)
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const classroomService = new ClassroomService()
        const result = await classroomService.create(req.body);
        return res.status(200).json(result);
    } catch (error: any) {
        next(error)
    }
};

const clasroomList = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = await prismaClient.classroom.findMany({
            where: {
                level: req.query.level,
                status: req.query.status
            },
            include: {
                classMajor: true
            }
        })

        if (!result) {
            throw new ResponseError(404, "classroom not found!")
        }

        return res.status(200).json({ data: result });
    } catch (error) {
        next(error)
    }
}

const getById = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = await prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                classMajor: true
            }
        })

        if (!result) {
            throw new ResponseError(404, "classroom not found!")
        }

        return res.status(200).json({ data: result });
    } catch (error) {
        next(error)
    }
}
const update = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        await transformAndValidate(CreateOrUpdateClassroomDto, req.body, {
            validator: { skipMissingProperties: true }
        });
    } catch (e: any) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const result = await prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!result) {
            throw new ResponseError(404, "classroom not found!")
        }

        await prismaClient.classroom.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: req.body,
        });

        return res.status(200).json({ message: "data successfully updated" });
    } catch (error) {
        next(error)
    }
}

const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = await prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!result) {
            throw new ResponseError(404, "classroom not found!")
        }

        await prismaClient.classroom.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });

        return res.status(200).json({ message: "data successfully deleted" });
    } catch (error) {
        next(error)
    }
}


const moveStudent = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const classroomService = new ClassroomService()
        const id = parseInt(req.params.id)
        await classroomService.moveStudent(req.body, id);


        return res.status(200).json({ message: "student succesfully moved" });
    } catch (error) {
        next(error)
    }
}

const deleteStudent = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const classroom = await prismaClient.classroom.findUnique({
            where: {
                id: parseInt(req.query.classroom_id)
            }
        })

        if (!classroom) {
            throw new ResponseError(404, "classroom not found!")
        }

        const student = await prismaClient.student.findUnique({
            where: { id: req.query.student_id }
        })

        if (!student) {
            throw new ResponseError(404, "student not found!")
        }

        await prismaClient.studentClassroom.delete({
            where: { student_id_classroom_id: { student_id: req.query.student_id, classroom_id: parseInt(req.query.classroom_id) } }
        })


        const studentClassrooms = await prismaClient.student.findUnique({
            where: { id: req.query.student_id },
            include: {
                student_classrooms: true
            }
        })
        if (!studentClassrooms?.student_classrooms.length) {
            await prismaClient.student.update({
                where: {
                    id: req.query.student_id
                },
                data: {
                    current_classroom_id: null
                }
            })
        }




        return res.status(200).json({ message: "data successfully deleted" });
    } catch (error) {
        next(error)
    }
}



export default {
    get,
    create,
    clasroomList,
    getById,
    update,
    deleted,
    moveStudent,
    deleteStudent
};
