import { Request, Response, NextFunction } from 'express';
import { uploadCloudinary } from '../middleware/handle-upload';

const upload = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {

        const url = await uploadCloudinary(req.file.path, req.body.folder);
        return res.status(200).json({
            type : req.body.type,
            url : url
        });
    } catch (error: any) {
        next(error)
    }
};


export default {
    upload
}