import { transformAndValidate } from "class-transformer-validator";
import { prismaClient } from "../../application/database";
import { ResponseError } from "../../error/response-error";
import { CreateOrUpdateClassroomDto } from "./dto/create-or-update-classroom.dto";
import { MoveStudentClassroomDto } from "./dto/move-student-classroom.dto";
import { ClassroomPaginationResult, ClassroomResponse } from "./interface/classroom.interface";

class ClassroomService {
  constructor() {}

 async get(request: any): Promise<ClassroomPaginationResult> {
    let result: any;

    await prismaClient.$transaction(async (tx) => {
      const page = request.page ?? 1;
      const size = request.size ?? 10;
      const skip = (parseInt(page) - 1) * parseInt(size);
      const filters: any = [];

      if (request.code) {
        filters.push({
          code: {
            contains: request.code,
          },
        });
      }

      if (request.level) {
        filters.push({
          level: {
            contains: request.level,
          },
        });
      }
      if (request.year_group) {
        filters.push({
          year_group: {
            equals: request.year_group,
          },
        });
      }

      if (request.status) {
        filters.push({
          status: {
            equals: request.status,
          },
        });
      }
      if (request.class_major_id) {
        filters.push({
          class_major_id: {
            equals: parseInt(request.class_major_id),
          },
        });
      }
      let orders: any = {
        [request.orderBy || "created_at"]: request.sortBy || "desc",
      };

      if (orders["classMajor.name"]) {
        orders = {
          classMajor: {
            name: orders["classMajor.name"],
          },
        };
      }

      const classrooms = await tx.classroom.findMany({
        orderBy: orders,
        where: {
          AND: filters,
        },
        include: {
          classMajor: true,
        },
        take: parseInt(size),
        skip: skip,
      });

      const totalItems = await tx.classroom.count({
        where: {
          AND: filters,
        },
      });

      result = {
        data: classrooms,
        paging: {
          page: page,
          total_item: totalItems,
          total_page: Math.ceil(totalItems / parseInt(size)),
        },
      };
    });
    return result;
  }


  async create(request: any) : Promise<ClassroomResponse> {
    try {
      await transformAndValidate(CreateOrUpdateClassroomDto, request);

      let result: any;

      await prismaClient.$transaction(async (tx) => {
        const classMajor = await tx.classMajor.findFirst({
          where: { id: request.class_major_id },
        });

        if (!classMajor) {
          throw new ResponseError(404, "class major not found!");
        }

        request.code = request.code.toUpperCase();
        result = await tx.classroom.create({
          data: request,
          select: {
            id: true,
            code: true,
            year_group: true,
            level: true,
            class_major_id: true,
            status: true,
          },
        });
      });

      return result;
    } catch (e: any) {
      if (Array.isArray(e)) {
        const errorMessages = e
          .map((error) => Object.values(error.constraints))
          .flat();
        throw new ResponseError(400, errorMessages);
      } else {
        throw new ResponseError(400, [e.toString()]);
      }
    }
  }

 

  async moveStudent(request: any, classroom_id: any) {
    try {
      await transformAndValidate(MoveStudentClassroomDto, request);

      await prismaClient.$transaction(async (tx) => {
        const classroom = await tx.classroom.findUnique({
          where: {
            id: classroom_id,
          },
        });

        if (!classroom) {
          throw new ResponseError(404, "classroom not found!");
        }
        const students = request.students;

        for (const data of students) {
          if (data.id) {
            await tx.studentClassroom.create({
              data: {
                student_id: data.id,
                classroom_id: classroom_id,
              },
            });
          }

          await tx.student.update({
            where: {
              id: data.id,
            },
            data: {
              current_classroom_id: classroom_id,
            },
          });
        }
      });
    } catch (e: any) {
      if (Array.isArray(e)) {
        const errorMessages = e
          .map((error) => Object.values(error.constraints))
          .flat();
        throw new ResponseError(400, errorMessages);
      } else {
        throw new ResponseError(400, [e.toString()]);
      }
    }
  }
}

export default ClassroomService;
