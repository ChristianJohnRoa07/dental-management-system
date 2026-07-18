/*
  Warnings:

  - You are about to drop the column `amount` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "amount",
ADD COLUMN     "amountReceived" DECIMAL(65,30),
ADD COLUMN     "procedurePrice" DECIMAL(65,30);
