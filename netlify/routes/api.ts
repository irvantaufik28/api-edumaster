import express from "express";

import authorized from "../middleware/jwt"
import userController from "../controller/userController";
import classMajorController from "../controller/classMajorController";
import classroomController from "../controller/classroomController";
import roleController from "../controller/roleController";
import studentController from "../controller/studentController";
import studentParentController from "../controller/studentParentController"
import staffController from "../controller/staffController"
import uploadMediaController from "../controller/uploadMediaController";
import { upload } from '../middleware/handle-upload'
import authController from "../controller/authController";
import courseController from "../controller/courseController";
import teacherCourseController from "../controller/teacherCourseController";
import classroomScheduleController from "../controller/classroomScheduleController";
import structureCurriculumController from "../controller/structureCurriculumController";
import permissionController from "../controller/permissionController";
import rolePermissionController from "../controller/rolePermissionController";

const router = express.Router();

router.post('/login', authController.login)
router.get('/class/major-list', classMajorController.list);

router.get('/user', authorized.allowedPermission(["all_access"]), userController.get);
router.get('/user/:id', authorized.allowedUser, userController.getById);

// classroom route
router.get('/classroom', authorized.allowedUser, classroomController.get);
router.get('/classroom-list', classroomController.clasroomList);
router.get('/classroom/:id',authorized.allowedUser, classroomController.getById);
router.post('/classroom', authorized.allowedPermission(["all_access", "create_classroom"]), classroomController.create);
router.put('/classroom/:id', authorized.allowedPermission(["all_access", "update_classroom"]), classroomController.update);
router.delete('/classroom/:id', authorized.allowedPermission(["all_access", "delete_classroom"]), classroomController.deleted);
router.post('/classroom/move-student/:id', authorized.allowedPermission(["all_access", "move_student"]), classroomController.moveStudent);
router.delete('/classroom/delete/student', authorized.allowedPermission(["all_access", "delete_student_classroom"]), classroomController.deleteStudent);

// class major route
router.get('/class/major', classMajorController.get);
router.get('/class/major/:id', classMajorController.getById);
router.post('/class/major', authorized.allowedPermission(["all_access", "create_classmajor"]), classMajorController.create);
router.put('/class/major/:id', authorized.allowedPermission(["all_access", "manager", "update_classmajor"]), classMajorController.update);
router.delete('/class/major/:id', authorized.allowedPermission(["all_access", "manager", "delete_classmajor"]), classMajorController.deleted);

// role route
router.get('/role', authorized.allowedUser, roleController.get)
router.get('/role/:id', authorized.allowedUser, roleController.getById)
router.post('/role', authorized.allowedPermission(["all_access", "create_role"]), roleController.create)
router.post('/user-role', authorized.allowedPermission(["all_access", "create_user_role"]), roleController.createUserRole)
router.delete('/user-role', authorized.allowedPermission(["all_access", "delete_user_role"]), roleController.deleteUserRole)

// permission route
router.get('/permission', authorized.allowedUser, permissionController.get)
router.post('/permission', authorized.allowedPermission(["all_access", "create_permission"]), permissionController.create)

// role permission route
router.get('/role-permission/:id', authorized.allowedUser, rolePermissionController.getById)
router.post('/role-permission',authorized.allowedPermission(["all_access", "create_role_permission"]),  rolePermissionController.create)
router.delete('/role-permission/:id',authorized.allowedPermission(["all_access", "delete_role_permission"]),  rolePermissionController.deleted)

// student route
router.get('/student', authorized.allowedUser, studentController.get)
router.get('/student/:id', authorized.allowedUser, studentController.getById)
router.post('/student', authorized.allowedPermission(["all_access", "create_student"]), studentController.create)
router.put('/student/:id', authorized.allowedPermission(["all_access", "update_student"]), studentController.update)

// student Parent Route
router.get('/student-parent', authorized.allowedUser, studentParentController.get)
router.get('/student-parent/:id',authorized.allowedUser, studentParentController.getById)
router.post('/student-parent', authorized.allowedPermission(["all_access", "create_student_parent"]), studentParentController.create)
router.put('/student-parent/:id', authorized.allowedPermission(["all_access", "update_student_parent"]), studentParentController.update)
router.delete('/student-parent/:id', authorized.allowedPermission(["all_access", "delete_student_parent"]), studentParentController.deleted)

// staff route
router.get('/staff',  authorized.allowedUser, staffController.get)
router.get('/staff/teacher',  authorized.allowedUser, staffController.getTeacher)
router.get('/staff/:id',  authorized.allowedUser, staffController.getById)
router.post('/staff', authorized.allowedPermission(["all_access", "create_staff"]), staffController.create)
router.put('/staff/:id', authorized.allowedPermission(["all_access", "update_staff"]), staffController.update)

// course route 
router.get('/course', authorized.allowedUser, courseController.get)
router.get('/course-list', courseController.list)
router.get('/course/:id', authorized.allowedUser, courseController.getById)
router.post('/course', authorized.allowedPermission(["all_access", "create_course"]), courseController.create)
router.put('/course/:id', authorized.allowedPermission(["all_access", "update_course"]), courseController.update)
router.delete('/course/:id', authorized.allowedPermission(["all_access", "delete_course"]), courseController.deleted)

// teacher course route 
router.get('/teacher/course',  authorized.allowedUser, teacherCourseController.get)
router.get('/teacher/course/:id',  authorized.allowedUser, teacherCourseController.getById)
router.get('/teacher/course-staff/:id',  authorized.allowedUser, teacherCourseController.getByStaffId)
router.post('/teacher/course', authorized.allowedPermission(["all_access", "create_teacher_course"]), teacherCourseController.create)
router.put('/teacher/course/:id', authorized.allowedPermission(["all_access", "update_teacher_course"]), teacherCourseController.update)
router.delete('/teacher/course/:id', authorized.allowedPermission(["all_access", "delete_teacher_course"]), teacherCourseController.deleted)

// classroom schedule route 
router.get('/classroom-schedule',authorized.allowedUser, classroomScheduleController.get)
router.get('/classroom-schedule/:id', authorized.allowedUser, classroomScheduleController.getById)
router.post('/classroom-schedule', authorized.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController.create)
router.post('/classroom-schedule/create-many', authorized.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController.createMany)
router.post('/classroom-schedule/structure-curriculum', authorized.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController.createFromStructureCurriCulum)
router.post('/classroom-schedule/structure-curriculum-template', authorized.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController.createScheduleStructureCurriCulum)
router.put('/classroom-schedule/:id', authorized.allowedPermission(["all_access", "update_classroom_schedule"]), classroomScheduleController.update)
router.delete('/classroom-schedule/:id', authorized.allowedPermission(["all_access", "delete_classroom_schedule"]), classroomScheduleController.deleted)

// structure curriculum route 
router.get('/structure-curriculum', authorized.allowedUser, structureCurriculumController.get)
router.get('/structure-curriculum/list', structureCurriculumController.list)
router.get('/structure-curriculum/:id', authorized.allowedUser, structureCurriculumController.getById)
router.post('/structure-curriculum', authorized.allowedPermission(["all_access", "create_structure_curriculum"]), structureCurriculumController.create)
router.put('/structure-curriculum/:id', authorized.allowedPermission(["all_access", "manager", "update_structure_curriculum"]), structureCurriculumController.update)
router.delete('/structure-curriculum/:id', authorized.allowedPermission(["all_access", "manager", "delete_structure_curriculum"]), structureCurriculumController.deleted)


//teacher schedule 
router.get('/teacher-schedule/:teacher_id', authorized.allowedUser, classroomScheduleController.getTeacherSchedule)

//media upload
router.post('/upload', upload.single('file'), authorized.allowedUser, uploadMediaController.upload)

export default router;