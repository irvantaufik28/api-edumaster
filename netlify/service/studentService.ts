import { transformAndValidate } from "class-transformer-validator";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { CreateOrUpdateClassroomDto } from "../dto/create-or-update-classroom.dto";
import bcrypt from "bcrypt";
import { generateDefaultPassword, generateNIS } from "../application/common/common";
import { createOrUpdateStudentDto } from "../dto/create-or-update-student.dto";
import { request } from "node:http";
import { PrismaClient } from "@prisma/client";
class StudentService {
    constructor() { }

    async get(request: any) {

        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters: any = [];

        if (request.nis) {
            filters.push({
                nis: {
                    contains: request.nis
                }
            })
        }
        if (request.first_name) {
            filters.push({
                first_name: {
                    contains: request.first_name,
                    mode: 'insensitive'
                }
            })
        }
        if (request.middle_name) {
            filters.push({
                middle_name: {
                    contains: request.middle_name,
                    mode: 'insensitive'
                }
            })
        }
        if (request.last_name) {
            filters.push({
                last_name: {
                    contains: request.last_name,
                    mode: 'insensitive'
                }
            })
        }
        if (request.status) {
            filters.push({
                status: {
                    equals: request.status,

                }
            })
        }
        if (request.register_year) {
            filters.push({
                register_year: {
                    equals: request.register_year,

                }
            })
        }

        if (request.current_classroom_id) {
            filters.push({
                current_classroom_id: {
                    equals: parseInt(request.current_classroom_id
                    )
                }
            })
        }

        if (request.not_in_classroom_id) {
            filters.push({
                student_classrooms: {
                    none: {
                        classroom_id: parseInt(request.not_in_classroom_id),
                    },
                },
            });
        }

        if (request.in_classroom_id) {
            filters.push({
                student_classrooms: {
                    some: {
                        classroom_id: parseInt(request.in_classroom_id),
                    },
                },
            });
        }



        let orders = {
            [request.orderBy || 'created_at']: request.sortBy || 'desc',
        };


        const students = await prismaClient.student.findMany({
            orderBy: orders,
            where: {
                AND: filters
            },
            include: {
                student_classrooms: {
                    include: {
                        classroom: true
                    }
                }

            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.student.count({
            where: {
                AND: filters
            }
        })

        return {
            data: students,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size))
            }
        }
    }





    async create(request: any) {
        try {
            await transformAndValidate(createOrUpdateStudentDto, request);
        } catch (e: any) {
            throw new ResponseError(400, e.toString());
        }

        let result: any;

        await prismaClient.$transaction(async (tx) => {
            const student = await tx.student.create({
                data: {
                    nis: generateNIS(new Date().getFullYear()),
                    first_name: request.first_name,
                    middle_name: request.middle_name,
                    last_name: request.last_name,
                    birth_date: request.birth_date,
                    birth_place: request.birth_place,
                    birth_certificate_no: request.birth_certificate_no,
                    family_identity_no: request.family_identity_no,
                    origin_academy: request.origin_academy,
                    religion: request.religion,
                    gender: request.gender,
                    status: "preparation",
                    register_year: request.register_year,
                    foto_url: request.foto_url
                },
                select: {
                    id: true,
                    nis: true
                }
            })
            const student_parents = request.student_parents

            for (const data of student_parents) {
                await tx.studentParent.create({
                    data: {
                        nik: data.nik,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        relationship: data.relationship,
                        phone: data.phone,
                        email: data.email,
                        job: data.job,
                        salary: data.salary,
                        address: data.address,
                        student_id: student.id
                    },
                    select: {
                        id: true,
                    }
                })
            }

            const defaultPassword = generateDefaultPassword(request.birth_date)

            const user_data = {
                username: student.nis,
                password: await bcrypt.hash(defaultPassword, 10)
            }

            const user = await tx.user.create({
                data: user_data,
                select: {
                    id: true
                }
            })

            const student_role = await tx.role.findFirst({
                where: {
                    name: "student"
                },
                select: {
                    id: true
                }
            })

            await tx.userRoles.create({
                data: {
                    user_id: user.id,
                    role_id: student_role?.id ? student_role?.id : 1
                }
            })

            await tx.studentUser.create({
                data: {
                    user_id: user.id,
                    student_id: student.id
                }
            })

            result = await tx.student.findFirst({
                where: {
                    id: student.id,
                },
                include: {
                    student_parents: true,
                    student_user: {
                        include: {
                            user: true
                        }
                    }
                }
            })
        })

        return result

    }




    async update(request: any, id: string) {
        try {
            await transformAndValidate(createOrUpdateStudentDto, request, {
                validator: {
                    skipMissingProperties: true
                }
            });
        } catch (e: any) {
            throw new ResponseError(400, e.toString())
        }

        let result: any
        await prismaClient.$transaction(async (tx) => {
            const student = await tx.student.update({
                where: {
                    id: id
                },
                data: {
                    first_name: request.first_name,
                    middle_name: request.middle_name,
                    last_name: request.last_name,
                    birth_date: request.birth_date,
                    birth_place: request.birth_place,
                    birth_certificate_no: request.birth_certificate_no,
                    family_identity_no: request.family_identity_no,
                    origin_academy: request.origin_academy,
                    religion: request.religion,
                    gender: request.gender,
                    status: request.status,
                    register_year: request.register_year,
                    foto_url: request.foto_url
                },
                select: {
                    id: true,
                    nis: true
                }
            })


            const parentsUpdateDataIds = request.student_parents.filter((o: any) => o.id).map((o: any) => o.id)
            const existStudentParents = await tx.studentParent.findMany({
                where: {
                    student_id: id,
                    id: {
                        notIn: parentsUpdateDataIds
                    }
                },
                select: {
                    id: true
                },

            })

            const deleteParentIds = existStudentParents.filter((o: any) => o.id).map((o: any) => o.id)

            if (existStudentParents.length > 0) {
                await tx.studentParent.deleteMany({
                    where: {
                        id: {
                            in: deleteParentIds,
                        },
                    },
                });
            }

            for (const data of request.student_parents) {
                if (data.id) {
                    await tx.studentParent.update({
                        where: {
                            id: data.id
                        },
                        data: {
                            nik: data.nik,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            relationship: data.relationship,
                            phone: data.phone,
                            email: data.email,
                            job: data.job,
                            salary: data.salary,
                            address: data.address,
                            student_id: student.id
                        },
                        select: {
                            id: true,
                        }
                    })
                } else {
                    await tx.studentParent.create({
                        data: {
                            nik: data.nik,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            relationship: data.relationship,
                            phone: data.phone,
                            email: data.email,
                            job: data.job,
                            salary: data.salary,
                            address: data.address,
                            student_id: student.id
                        },
                    })
                }
            }


            result = await tx.student.findFirst({
                where: {
                    id: student.id,
                },
                include: {
                    student_parents: true,
                    student_user: {
                        include: {
                            user: true
                        }
                    }
                }
            })

        })

        return result

    }




}

export default StudentService