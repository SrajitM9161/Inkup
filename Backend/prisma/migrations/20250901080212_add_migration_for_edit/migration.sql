-- CreateEnum
CREATE TYPE "EditStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "EditGeneration" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "prompt" TEXT NOT NULL,
    "status" "EditStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditAsset" (
    "id" UUID NOT NULL,
    "editGenerationId" UUID NOT NULL,
    "inputImageUrl" TEXT,
    "outputImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EditGeneration" ADD CONSTRAINT "EditGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditAsset" ADD CONSTRAINT "EditAsset_editGenerationId_fkey" FOREIGN KEY ("editGenerationId") REFERENCES "EditGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
