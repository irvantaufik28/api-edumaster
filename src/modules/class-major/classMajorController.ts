import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../../application/database';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateOrUpdateClassMajorDto } from './dto/create-or-update-classmajor.dto';
import { ResponseError } from '../../error/response-error';
import ClassMajorService from './classMajorService';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const service = new ClassMajorService()
        const result = await service.get({
            name: req.query.name,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        })
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
const getById = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const classmajor = await prismaClient.classMajor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })


        if (!classmajor) {
            throw new ResponseError(404, "classmajor not found")
        }

        return res.status(200).json({
            data: classmajor
        });
    } catch (error) {
        next(error);
    }
};

const list = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const classmajor = await prismaClient.classMajor.findMany(
        )
        return res.status(200).json({ data: classmajor });
    } catch (error) {
        next(error);
    }
};

const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        await transformAndValidate(CreateOrUpdateClassMajorDto, req.body);
    } catch (e: any) {
        return new ResponseError(400, e.toString())
    }

    try {
        const result = await prismaClient.classMajor.create({
            data: req.body,
            select: {
                id: true,
                name: true
            }
        })
        return res.status(200).json(result);
    } catch (error: any) {
        next(error)
    }
};

const update = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        await transformAndValidate(CreateOrUpdateClassMajorDto, req.body, {
            validator: { skipMissingProperties: true }
        });
    } catch (e: any) {
        return new ResponseError(400, e.toString())
    }


    try {

        const classmajor = await prismaClient.classMajor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!classmajor) {
            throw new ResponseError(404, "classmajor not found")
        }

        const result = await prismaClient.classMajor.update({
            data: req.body,
            where: ({
                id: parseInt(req.params.id)
            })
        })
        return res.status(200).json({ message: "classmajor successfuly updated" });
    } catch (error: any) {
        next(error)
    }
};

const deleted = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const classmajor = await prismaClient.classMajor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!classmajor) {
            throw new ResponseError(404, "classmajor not found")
        }

        await prismaClient.classMajor.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        return res.status(200).json({
            message: "classmajor successfully deleted"
        });
    } catch (error) {
        next(error);
    }
};


export default {
    get,
    list,
    getById,
    create,
    update,
    deleted
};
