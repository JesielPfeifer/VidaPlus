/*
  Warnings:

  - Added the required column `perfil` to the `usuario_admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `usuario_admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuario_admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "perfil" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
