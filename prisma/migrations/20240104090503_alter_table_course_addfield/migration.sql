/*
  Warnings:

  - You are about to drop the column `semester` on the `classroom_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `classroom_schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classroom_schedule" DROP COLUMN "semester",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "semester" TEXT,
ADD COLUMN     "type" TEXT;
