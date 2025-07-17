/*
  Warnings:

  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `concurrency` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Concurrency" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('THERAPIST', 'GUIDE', 'ADMIN');

-- CreateEnum
CREATE TYPE "TechniqueStatus" AS ENUM ('PRACTITIONER', 'THERAPIST');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PROGRAMMED', 'DONE');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropIndex
DROP INDEX "Patient_email_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "patientId",
DROP COLUMN "price",
ADD COLUMN     "concurrency" "Concurrency" NOT NULL,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PROGRAMMED',
ALTER COLUMN "serviceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "secondlastname" TEXT,
ADD COLUMN     "secondname" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'THERAPIST',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTechnique" (
    "id" TEXT NOT NULL,
    "status" "TechniqueStatus" NOT NULL DEFAULT 'PRACTITIONER',
    "userId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceId" TEXT,
    "packageId" TEXT,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientServiceBalance" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "patientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientServiceBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientServiceUsage" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "appointmentId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientServiceUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTechniqueUsageLog" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTechniqueUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ServiceToTechnique" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AppointmentToPatient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserTechnique_userId_techniqueId_key" ON "UserTechnique"("userId", "techniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientServiceBalance_patientId_serviceId_saleId_key" ON "PatientServiceBalance"("patientId", "serviceId", "saleId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientServiceUsage_appointmentId_balanceId_key" ON "PatientServiceUsage"("appointmentId", "balanceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTechniqueUsageLog_userId_techniqueId_appointmentId_key" ON "UserTechniqueUsageLog"("userId", "techniqueId", "appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToTechnique_AB_unique" ON "_ServiceToTechnique"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToTechnique_B_index" ON "_ServiceToTechnique"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AppointmentToPatient_AB_unique" ON "_AppointmentToPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_AppointmentToPatient_B_index" ON "_AppointmentToPatient"("B");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechnique" ADD CONSTRAINT "UserTechnique_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechnique" ADD CONSTRAINT "UserTechnique_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientServiceBalance" ADD CONSTRAINT "PatientServiceBalance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientServiceBalance" ADD CONSTRAINT "PatientServiceBalance_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientServiceBalance" ADD CONSTRAINT "PatientServiceBalance_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientServiceUsage" ADD CONSTRAINT "PatientServiceUsage_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientServiceUsage" ADD CONSTRAINT "PatientServiceUsage_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "PatientServiceBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechniqueUsageLog" ADD CONSTRAINT "UserTechniqueUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechniqueUsageLog" ADD CONSTRAINT "UserTechniqueUsageLog_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechniqueUsageLog" ADD CONSTRAINT "UserTechniqueUsageLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTechnique" ADD CONSTRAINT "_ServiceToTechnique_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToTechnique" ADD CONSTRAINT "_ServiceToTechnique_B_fkey" FOREIGN KEY ("B") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToPatient" ADD CONSTRAINT "_AppointmentToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToPatient" ADD CONSTRAINT "_AppointmentToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
