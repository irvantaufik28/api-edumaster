/*
  Warnings:

  - You are about to drop the `user_permission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role_id` to the `permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_permission" DROP CONSTRAINT "user_permission_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "user_permission" DROP CONSTRAINT "user_permission_user_id_fkey";

-- AlterTable
ALTER TABLE "permission" ADD COLUMN     "role_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "user_permission";

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
