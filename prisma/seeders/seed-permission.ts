import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const permissionsData = [
    'all_access',
    'create_classroom',
    'update_classroom',
    'delete_classroom',
    'move_student',
    'delete_student_classroom',
    'create_classmajor',
    'update_classmajor',
    'delete_classmajor',
    'create_role',
    'create_user_role',
    'delete_user_role',
    'create_permission',
    'create_role_permission',
    'delete_role_permission',
    'create_student',
    'update_student',
    'create_student_parent',
    'update_student_parent',
    'delete_student_parent',
    'create_staff',
    'update_staff',
    'create_course',
    'update_course',
    'delete_course',
    'create_teacher_course',
    'update_teacher_course',
    'delete_teacher_course',
    'create_classroom_schedule',
    'update_classroom_schedule',
    'delete_classroom_schedule',
    'create_structure_curriculum',
    'update_structure_curriculum',
    'delete_structure_curriculum',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
    'dummy_',
  ];

  const createdPermissions = await Promise.all(
    permissionsData.map(async (permissionName) => {
      return prisma.permission.create({
        data: {
          name: permissionName,
        },
      });
    })
  );

  console.log({ createdPermissions });
}

main()
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });