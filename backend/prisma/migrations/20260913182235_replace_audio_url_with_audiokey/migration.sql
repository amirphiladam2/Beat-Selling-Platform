/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Beat` table. All the data in the column will be lost.
  - Added the required column `audioKey` to the `Beat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Beat"
RENAME COLUMN "audioUrl" TO "audioKey";
