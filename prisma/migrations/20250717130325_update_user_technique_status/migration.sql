/*
  Warnings:

  - You are about to drop the `UserTechnique` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTechnique" DROP CONSTRAINT "UserTechnique_techniqueId_fkey";

-- DropForeignKey
ALTER TABLE "UserTechnique" DROP CONSTRAINT "UserTechnique_userId_fkey";

-- DropTable
DROP TABLE "UserTechnique";

-- CreateTable
CREATE TABLE "UserTechniqueStatus" (
    "id" TEXT NOT NULL,
    "status" "TechniqueStatus" NOT NULL DEFAULT 'PRACTITIONER',
    "userId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTechniqueStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTechniqueStatus_userId_techniqueId_key" ON "UserTechniqueStatus"("userId", "techniqueId");

-- AddForeignKey
ALTER TABLE "UserTechniqueStatus" ADD CONSTRAINT "UserTechniqueStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechniqueStatus" ADD CONSTRAINT "UserTechniqueStatus_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;
