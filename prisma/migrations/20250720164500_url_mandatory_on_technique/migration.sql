/*
  Warnings:

  - Made the column `url` on table `Technique` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Technique" ALTER COLUMN "url" SET NOT NULL;
