/*
  Warnings:

  - A unique constraint covering the columns `[crm]` on the table `profissional` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coren]` on the table `profissional` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dataNascimento` on table `paciente` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "paciente" ALTER COLUMN "dataNascimento" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profissional_crm_key" ON "profissional"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "profissional_coren_key" ON "profissional"("coren");
