"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const userController_1 = __importDefault(require("../controller/userController"));
const classMajorController_1 = __importDefault(require("../controller/classMajorController"));
const classroomController_1 = __importDefault(require("../controller/classroomController"));
const roleController_1 = __importDefault(require("../controller/roleController"));
const studentController_1 = __importDefault(require("../controller/studentController"));
const studentParentController_1 = __importDefault(require("../controller/studentParentController"));
const staffController_1 = __importDefault(require("../controller/staffController"));
const courseController_1 = __importDefault(require("../controller/courseController"));
const teacherCourseController_1 = __importDefault(require("../controller/teacherCourseController"));
const classroomScheduleController_1 = __importDefault(require("../controller/classroomScheduleController"));
const structureCurriculumController_1 = __importDefault(require("../controller/structureCurriculumController"));
const permissionController_1 = __importDefault(require("../controller/permissionController"));
const rolePermissionController_1 = __importDefault(require("../controller/rolePermissionController"));
const router = express_1.default.Router();
router.get('/class/major-list', classMajorController_1.default.list);
router.get('/user', jwt_1.default.allowedPermission(["all_access"]), userController_1.default.get);
router.get('/user/:id', jwt_1.default.allowedUser, userController_1.default.getById);
// classroom route
router.get('/classroom', jwt_1.default.allowedUser, classroomController_1.default.get);
router.get('/classroom-list', jwt_1.default.allowedUser, classroomController_1.default.clasroomList);
router.get('/classroom/:id', jwt_1.default.allowedUser, classroomController_1.default.getById);
router.post('/classroom', jwt_1.default.allowedPermission(["all_access", "create_classroom"]), classroomController_1.default.create);
router.put('/classroom/:id', jwt_1.default.allowedPermission(["all_access", "update_classroom"]), classroomController_1.default.update);
router.delete('/classroom/:id', jwt_1.default.allowedPermission(["all_access", "delete_classroom"]), classroomController_1.default.deleted);
router.post('/classroom/move-student/:id', jwt_1.default.allowedPermission(["all_access", "move_student"]), classroomController_1.default.moveStudent);
router.delete('/classroom/delete/student', jwt_1.default.allowedPermission(["all_access", "delete_student_classroom"]), classroomController_1.default.deleteStudent);
// class major route
router.get('/class/major', classMajorController_1.default.get);
router.get('/class/major/:id', classMajorController_1.default.getById);
router.post('/class/major', jwt_1.default.allowedPermission(["all_access", "create_classmajor"]), classMajorController_1.default.create);
router.put('/class/major/:id', jwt_1.default.allowedPermission(["all_access", "manager", "update_classmajor"]), classMajorController_1.default.update);
router.delete('/class/major/:id', jwt_1.default.allowedPermission(["all_access", "manager", "delete_classmajor"]), classMajorController_1.default.deleted);
// role route
router.get('/role', jwt_1.default.allowedUser, roleController_1.default.get);
router.get('/role/:id', jwt_1.default.allowedUser, roleController_1.default.getById);
router.post('/role', jwt_1.default.allowedPermission(["all_access", "create_role"]), roleController_1.default.create);
router.post('/user-role', jwt_1.default.allowedPermission(["all_access", "create_user_role"]), roleController_1.default.createUserRole);
router.delete('/user-role', jwt_1.default.allowedPermission(["all_access", "delete_user_role"]), roleController_1.default.deleteUserRole);
// permission route
router.get('/permission', jwt_1.default.allowedUser, permissionController_1.default.get);
router.post('/permission', jwt_1.default.allowedPermission(["all_access", "create_permission"]), permissionController_1.default.create);
// role permission route
router.get('/role-permission/:id', jwt_1.default.allowedUser, rolePermissionController_1.default.getById);
router.post('/role-permission', jwt_1.default.allowedPermission(["all_access", "create_role_permission"]), rolePermissionController_1.default.create);
router.delete('/role-permission/:id', jwt_1.default.allowedPermission(["all_access", "delete_role_permission"]), rolePermissionController_1.default.deleted);
// student route
router.get('/student', jwt_1.default.allowedUser, studentController_1.default.get);
router.get('/student/:id', jwt_1.default.allowedUser, studentController_1.default.getById);
router.post('/student', jwt_1.default.allowedPermission(["all_access", "create_student"]), studentController_1.default.create);
router.put('/student/:id', jwt_1.default.allowedPermission(["all_access", "update_student"]), studentController_1.default.update);
// student Parent Route
router.get('/student-parent', jwt_1.default.allowedUser, studentParentController_1.default.get);
router.get('/student-parent/:id', jwt_1.default.allowedUser, studentParentController_1.default.getById);
router.post('/student-parent', jwt_1.default.allowedPermission(["all_access", "create_student_parent"]), studentParentController_1.default.create);
router.put('/student-parent/:id', jwt_1.default.allowedPermission(["all_access", "update_student_parent"]), studentParentController_1.default.update);
router.delete('/student-parent/:id', jwt_1.default.allowedPermission(["all_access", "delete_student_parent"]), studentParentController_1.default.deleted);
// staff route
router.get('/staff', jwt_1.default.allowedUser, staffController_1.default.get);
router.get('/staff/teacher', jwt_1.default.allowedUser, staffController_1.default.getTeacher);
router.get('/staff/:id', jwt_1.default.allowedUser, staffController_1.default.getById);
router.post('/staff', jwt_1.default.allowedPermission(["all_access", "create_staff"]), staffController_1.default.create);
router.put('/staff/:id', jwt_1.default.allowedPermission(["all_access", "update_staff"]), staffController_1.default.update);
// course route 
router.get('/course', jwt_1.default.allowedUser, courseController_1.default.get);
router.get('/course-list', courseController_1.default.list);
router.get('/course/:id', jwt_1.default.allowedUser, courseController_1.default.getById);
router.post('/course', jwt_1.default.allowedPermission(["all_access", "create_course"]), courseController_1.default.create);
router.put('/course/:id', jwt_1.default.allowedPermission(["all_access", "update_course"]), courseController_1.default.update);
router.delete('/course/:id', jwt_1.default.allowedPermission(["all_access", "delete_course"]), courseController_1.default.deleted);
// teacher course route 
router.get('/teacher/course', jwt_1.default.allowedUser, teacherCourseController_1.default.get);
router.get('/teacher/course/:id', jwt_1.default.allowedUser, teacherCourseController_1.default.getById);
router.get('/teacher/course-staff/:id', jwt_1.default.allowedUser, teacherCourseController_1.default.getByStaffId);
router.post('/teacher/course', jwt_1.default.allowedPermission(["all_access", "create_teacher_course"]), teacherCourseController_1.default.create);
router.put('/teacher/course/:id', jwt_1.default.allowedPermission(["all_access", "update_teacher_course"]), teacherCourseController_1.default.update);
router.delete('/teacher/course/:id', jwt_1.default.allowedPermission(["all_access", "delete_teacher_course"]), teacherCourseController_1.default.deleted);
// classroom schedule route 
router.get('/classroom-schedule', jwt_1.default.allowedUser, classroomScheduleController_1.default.get);
router.get('/classroom-schedule/:id', jwt_1.default.allowedUser, classroomScheduleController_1.default.getById);
router.post('/classroom-schedule', jwt_1.default.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController_1.default.create);
router.post('/classroom-schedule/create-many', jwt_1.default.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController_1.default.createMany);
router.post('/classroom-schedule/structure-curriculum', jwt_1.default.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController_1.default.createFromStructureCurriCulum);
router.post('/classroom-schedule/structure-curriculum-template', jwt_1.default.allowedPermission(["all_access", "create_classroom_schedule"]), classroomScheduleController_1.default.createScheduleStructureCurriCulum);
router.put('/classroom-schedule/:id', jwt_1.default.allowedPermission(["all_access", "update_classroom_schedule"]), classroomScheduleController_1.default.update);
router.delete('/classroom-schedule/:id', jwt_1.default.allowedPermission(["all_access", "delete_classroom_schedule"]), classroomScheduleController_1.default.deleted);
// structure curriculum route 
router.get('/structure-curriculum', jwt_1.default.allowedUser, structureCurriculumController_1.default.get);
router.get('/structure-curriculum/list', structureCurriculumController_1.default.list);
router.get('/structure-curriculum/:id', jwt_1.default.allowedUser, structureCurriculumController_1.default.getById);
router.post('/structure-curriculum', jwt_1.default.allowedPermission(["all_access", "create_structure_curriculum"]), structureCurriculumController_1.default.create);
router.put('/structure-curriculum/:id', jwt_1.default.allowedPermission(["all_access", "manager", "update_structure_curriculum"]), structureCurriculumController_1.default.update);
router.delete('/structure-curriculum/:id', jwt_1.default.allowedPermission(["all_access", "manager", "delete_structure_curriculum"]), structureCurriculumController_1.default.deleted);
//teacher schedule 
router.get('/teacher-schedule/:teacher_id', jwt_1.default.allowedUser, classroomScheduleController_1.default.getTeacherSchedule);
exports.default = router;
//# sourceMappingURL=api.js.map