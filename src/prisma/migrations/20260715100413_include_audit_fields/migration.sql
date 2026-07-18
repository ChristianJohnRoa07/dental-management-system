/*
  Warnings:

  - Added the required column `createdBy` to the `PatientImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientImage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL;
