/*
  Warnings:

  - You are about to alter the column `maskImageUrl` on the `Generation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "Generation" ALTER COLUMN "maskImageUrl" SET DATA TYPE VARCHAR(500);
