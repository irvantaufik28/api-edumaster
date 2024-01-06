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

const router = express.Router();

router.post('/login', authController.login)
router.get('/class/major-list', classMajorController.list);

router.get('/user', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), userController.get);
router.get('/user/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), userController.getById);

// classroom route
router.get('/classroom', classroomController.get);
router.get('/classroom-list', classroomController.clasroomList);
router.get('/classroom/:id', classroomController.getById);
router.post('/classroom', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomController.create);
router.put('/classroom/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomController.update);
router.delete('/classroom/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomController.deleted);
router.post('/classroom/move-student/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomController.moveStudent);
router.delete('/classroom/delete/student', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomController.deleteStudent);

// class major route
router.get('/class/major', classMajorController.get);
router.get('/class/major/:id', classMajorController.getById);
router.post('/class/major', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classMajorController.create);
router.put('/class/major/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classMajorController.update);
router.delete('/class/major/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classMajorController.deleted);

// role route
router.get('/role', roleController.get)
router.post('/role', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), roleController.create)
router.post('/user-role', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), roleController.createUserRole)
router.delete('/user-role', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), roleController.deleteUserRole)

// student route
router.get('/student', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), studentController.get)
router.get('/student/:id', studentController.getById)
router.post('/student', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), studentController.create)
router.put('/student/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), studentController.update)

// student Parent Route
router.get('/student-parent', studentParentController.get)
router.get('/student-parent/:id', studentParentController.getById)
router.post('/student-parent', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), studentParentController.create)
router.put('/student-parent/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), studentParentController.update)
router.delete('/student-parent/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), studentParentController.deleted)

// staff route
router.get('/staff', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), staffController.get)
router.get('/staff/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), staffController.getById)
router.post('/staff', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), staffController.create)
router.put('/staff/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), staffController.update)

// course route 
router.get('/course', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), courseController.get)
router.get('/course-list', courseController.list)
router.get('/course/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), courseController.getById)
router.post('/course', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), courseController.create)
router.put('/course/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), courseController.update)
router.delete('/course/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), courseController.deleted)

// teacher course route 
router.get('/teacher/course', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), teacherCourseController.get)
router.get('/teacher/course/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), teacherCourseController.getById)
router.get('/teacher/course-staff/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), teacherCourseController.getByStaffId)
router.post('/teacher/course', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), teacherCourseController.create)
router.put('/teacher/course/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), teacherCourseController.update)
router.delete('/teacher/course/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), teacherCourseController.deleted)

// classroom schedule route 
router.get('/classroom-schedule', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.get)
router.get('/classroom-schedule/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.getById)
router.post('/classroom-schedule', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.create)
router.post('/classroom-schedule/create-many', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.createMany)
router.post('/classroom-schedule/structure-curriculum', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.createFromStructureCurriCulum)
router.post('/classroom-schedule/structure-curriculum-template', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.createScheduleStructureCurriCulum)
router.put('/classroom-schedule/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.update)
router.delete('/classroom-schedule/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.deleted)

// structure curriculum route 
router.get('/structure-curriculum', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), structureCurriculumController.get)
router.get('/structure-curriculum/list', structureCurriculumController.list)
router.get('/structure-curriculum/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), structureCurriculumController.getById)
router.post('/structure-curriculum', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), structureCurriculumController.create)
router.put('/structure-curriculum/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), structureCurriculumController.update)
router.delete('/structure-curriculum/:id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), structureCurriculumController.deleted)


//teacher schedule 
router.get('/teacher-schedule/:teacher_id', authorized.allowedRoles(["administrator", "manager", "staff_tu"]), classroomScheduleController.getTeacherSchedule)

//media upload
router.post('/upload', upload.single('file'), authorized.allowedRoles(["administrator", "manager", "staff_tu"]), uploadMediaController.upload)

export default router;