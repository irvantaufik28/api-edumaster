-- CreateTable
CREATE TABLE "teacher_course" (
    "id" SERIAL NOT NULL,
    "staff_id" UUID NOT NULL,
    "courses_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom_schedule" (
    "id" SERIAL NOT NULL,
    "classroom_id" INTEGER NOT NULL,
    "day_name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "teacher_course_id" INTEGER NOT NULL,

    CONSTRAINT "classroom_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_courses_id_fkey" FOREIGN KEY ("courses_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_schedule" ADD CONSTRAINT "classroom_schedule_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_schedule" ADD CONSTRAINT "classroom_schedule_teacher_course_id_fkey" FOREIGN KEY ("teacher_course_id") REFERENCES "teacher_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
