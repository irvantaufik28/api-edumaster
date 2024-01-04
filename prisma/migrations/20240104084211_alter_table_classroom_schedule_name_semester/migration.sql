/*
  Warnings:

  - You are about to drop the column `semseter` on the `classroom_schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classroom_schedule" DROP COLUMN "semseter",
ADD COLUMN     "semester" TEXT;
