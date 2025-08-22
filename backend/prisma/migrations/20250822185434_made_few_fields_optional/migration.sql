-- AlterTable
ALTER TABLE "public"."Analysis" ALTER COLUMN "matchScore" DROP NOT NULL,
ALTER COLUMN "suggestedEdits" DROP NOT NULL;
