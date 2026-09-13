-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('RB', 'HIP_HOP', 'POP', 'ELECTRONIC');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('ATMOSPHERIC', 'SOULFUL', 'DARK', 'CHILL', 'BRIGHT', 'EUPHORIC');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('BASIC', 'PREMIUM', 'EXCLUSIVE');

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "type" "LicenseType" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "beatId" INTEGER NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beat" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "genre" "Genre" NOT NULL,
    "mood" "Mood",
    "bpm" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "audioUrl" TEXT NOT NULL,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "Beat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
