/*
  Warnings:

  - You are about to drop the column `isComplete` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isComplete",
ADD COLUMN     "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false;
