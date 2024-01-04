/*
  Warnings:

  - You are about to drop the column `courses_id` on the `teacher_course` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `teacher_course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "teacher_course" DROP CONSTRAINT "teacher_course_courses_id_fkey";

-- AlterTable
ALTER TABLE "teacher_course" DROP COLUMN "courses_id",
ADD COLUMN     "course_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
