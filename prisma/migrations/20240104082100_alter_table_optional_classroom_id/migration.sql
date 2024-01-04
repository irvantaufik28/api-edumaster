-- DropForeignKey
ALTER TABLE "classroom_schedule" DROP CONSTRAINT "classroom_schedule_classroom_id_fkey";

-- AlterTable
ALTER TABLE "classroom_schedule" ALTER COLUMN "classroom_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "classroom_schedule" ADD CONSTRAINT "classroom_schedule_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
