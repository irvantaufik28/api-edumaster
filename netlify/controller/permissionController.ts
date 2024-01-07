import { Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';

const get = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {


        const permissions = await prismaClient.permission.findMany()


        return res.status(200).json({ data: permissions });
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