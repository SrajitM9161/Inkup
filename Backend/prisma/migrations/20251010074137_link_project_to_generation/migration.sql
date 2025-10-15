/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `Generation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Generation" ADD COLUMN     "projectId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Generation_projectId_key" ON "public"."Generation"("projectId");

-- AddForeignKey
ALTER TABLE "public"."Generation" ADD CONSTRAINT "Generation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
