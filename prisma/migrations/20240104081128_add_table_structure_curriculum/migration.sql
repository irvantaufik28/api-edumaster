-- AlterTable
ALTER TABLE "classroom_schedule" ADD COLUMN     "structure_curriculum_id" INTEGER;

-- CreateTable
CREATE TABLE "structure_curriculum" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "year_group" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "structure_curriculum_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "classroom_schedule" ADD CONSTRAINT "classroom_schedule_structure_curriculum_id_fkey" FOREIGN KEY ("structure_curriculum_id") REFERENCES "structure_curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
