/*
  Warnings:

  - You are about to drop the column `overallRisk` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "overallRisk",
ADD COLUMN     "expertData" JSONB,
ALTER COLUMN "contractData" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
