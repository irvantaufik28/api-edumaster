-- DropForeignKey
ALTER TABLE "classroom_schedule" DROP CONSTRAINT "classroom_schedule_teacher_course_id_fkey";

-- AlterTable
ALTER TABLE "classroom_schedule" ADD COLUMN     "course_id" INTEGER,
ALTER COLUMN "day_name" DROP NOT NULL,
ALTER COLUMN "start_time" DROP NOT NULL,
ALTER COLUMN "end_time" DROP NOT NULL,
ALTER COLUMN "teacher_course_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "classroom_schedule" ADD CONSTRAINT "classroom_schedule_teacher_course_id_fkey" FOREIGN KEY ("teacher_course_id") REFERENCES "teacher_course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_schedule" ADD CONSTRAINT "classroom_schedule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
