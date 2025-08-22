/*
  Warnings:

  - The primary key for the `Analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Jd` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `suggestedEdits` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AnalysisStatus" AS ENUM ('queued', 'processing', 'completed', 'failed');

-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_jdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Jd" DROP CONSTRAINT "Jd_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_pkey",
ADD COLUMN     "error" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recommendations" TEXT[],
ADD COLUMN     "status" "public"."AnalysisStatus" NOT NULL DEFAULT 'queued',
ADD COLUMN     "strengths" TEXT[],
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "resumeId" SET DATA TYPE TEXT,
ALTER COLUMN "jdId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
DROP COLUMN "suggestedEdits",
ADD COLUMN     "suggestedEdits" JSONB NOT NULL,
ADD CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Analysis_id_seq";

-- AlterTable
ALTER TABLE "public"."Jd" DROP CONSTRAINT "Jd_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Jd_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Jd_id_seq";

-- AlterTable
ALTER TABLE "public"."Resume" DROP CONSTRAINT "Resume_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Resume_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Resume_id_seq";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Jd" ADD CONSTRAINT "Jd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "public"."Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_jdId_fkey" FOREIGN KEY ("jdId") REFERENCES "public"."Jd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
