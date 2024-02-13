import { transformAndValidate } from "class-transformer-validator";
import { prismaClient } from "../../application/database";
import { ResponseError } from "../../error/response-error";
import { CreateOrUpdateClassMajorDto } from "./dto/create-or-update-classmajor.dto";

class ClassMajorService {

    async get(request: any) {

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

        let orders = {
            [request.orderBy || 'created_at']: request.sortBy || 'desc',
        };


        const classmajor = await prismaClient.classMajor.findMany({
            orderBy: orders,
            where: {
                AND: filters
            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.classMajor.count({
            where: {
                AND: filters
            }
        })

        return {
            data: classmajor,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size))
            }
        }
    }
}

export default ClassMajorService