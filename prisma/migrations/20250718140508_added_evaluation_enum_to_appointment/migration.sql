/*
  Warnings:

  - You are about to drop the column `validatedByGuide` on the `Appointment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AppointmentEvaluation" AS ENUM ('UNDER_EVALUATION', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "validatedByGuide",
ADD COLUMN     "evaluation" "AppointmentEvaluation";
