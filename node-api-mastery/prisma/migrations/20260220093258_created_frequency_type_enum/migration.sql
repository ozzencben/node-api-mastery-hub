/*
  Warnings:

  - Changed the type of `frequency` on the `RecurringTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('MONTHLY', 'WEEKLY');

-- AlterTable
ALTER TABLE "RecurringTransaction" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "FrequencyType" NOT NULL;
