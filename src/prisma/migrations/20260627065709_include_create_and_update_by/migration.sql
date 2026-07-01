/*
  Warnings:

  - Added the required column `createdBy` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Procedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Procedure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Procedure" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
