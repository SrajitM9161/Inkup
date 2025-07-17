-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Generation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userImageUrl" VARCHAR(500) NOT NULL,
    "itemImageUrl" VARCHAR(500) NOT NULL,
    "outputImageUrl" VARCHAR(500),
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
