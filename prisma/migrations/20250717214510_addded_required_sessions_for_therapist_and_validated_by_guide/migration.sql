-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "validatedByGuide" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Technique" ADD COLUMN     "requiredSessionsForTherapist" INTEGER NOT NULL DEFAULT 10;
