/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "teacher_course" DROP CONSTRAINT "teacher_course_courses_id_fkey";

-- DropTable
DROP TABLE "Course";

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_courses_id_fkey" FOREIGN KEY ("courses_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
