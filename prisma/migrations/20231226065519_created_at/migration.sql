/*
  Warnings:

  - Added the required column `updated_at` to the `classroom_schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `teacher_course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classroom_schedule" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "teacher_course" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
