/*
  Warnings:

  - You are about to drop the column `itemImageUrl` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `maskImageUrl` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `outputImageUrl` on the `Generation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "itemImageUrl",
DROP COLUMN "maskImageUrl",
DROP COLUMN "outputImageUrl";

-- CreateTable
CREATE TABLE "GenerationAsset" (
    "id" UUID NOT NULL,
    "generationId" UUID NOT NULL,
    "itemImageUrl" TEXT,
    "maskImageUrl" TEXT,
    "outputImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GenerationAsset" ADD CONSTRAINT "GenerationAsset_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
