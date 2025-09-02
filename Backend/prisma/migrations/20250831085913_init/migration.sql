-- CreateTable
CREATE TABLE "Tattoo" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tattoo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tattoo_userId_deleted_idx" ON "Tattoo"("userId", "deleted");

-- AddForeignKey
ALTER TABLE "Tattoo" ADD CONSTRAINT "Tattoo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
