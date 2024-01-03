import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateOrUpdateClassroomDto } from '../dto/create-or-update-classroom.dto';
import { CreateOrUpdateStudentParentDto } from '../dto/create-or-update-studentParent.Dto';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        
        const request = {
            first_name: req.query.first_name,
            last_name: req.query.last_name,
            nik: req.query.nik,
            student_id: req.query.student_id,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }
        const result = await prismaClient.studentParent.findMany()
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        await transformAndValidate(CreateOrUpdateStudentParentDto, req.body);
    } catch (e: any) {
        return res.status(404).json({ message: e.toString() });
    }

    try {

        const student = await prismaClient.student.findUnique({
            where: {
                id: req.body.student_id
            }
        })

        if (!student) {
            throw new ResponseError(404, "student not found!")
        }
        const result = await prismaClient.studentParent.create({
            data: req.body
        });

        return res.status(200).json(result);
    } catch (error: any) {
        next(error)
    }
};

const getById = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = await prismaClient.studentParent.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                student: true
            }
        })

        if (!result) {
            throw new ResponseError(404, "student parent not found!")
        }

        return res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}
const update = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        await transformAndValidate(CreateOrUpdateStudentParentDto, req.body, {
            validator: {skipMissingProperties: true}
        });
    } catch (e: any) {
        return res.status(404).json({ message: e.toString() });
    }
    try {
        const result = await prismaClient.studentParent.findUnique({
            where: {
                id: req.params.id
            }
        })

        if (!result) {
            throw new ResponseError(404, "classroom not found!")
        }

        await prismaClient.studentParent.update({
            where: {
                id: req.params.id,
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
        const result = await prismaClient.studentParent.findUnique({
            where: {
                id: req.params.id
            }
        })

        if (!result) {
            throw new ResponseError(404, "student parent not found!")
        }

        await prismaClient.studentParent.delete({
            where: {
                id: req.params.id,
            },
        });

        return res.status(200).json({ message: "data successfully deleted" });
    } catch (error) {
        next(error)
    }
}

export default {
    get,
    getById,
    update,
    create,
    deleted
}