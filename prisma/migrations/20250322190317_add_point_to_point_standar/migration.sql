/*
  Warnings:

  - Added the required column `point` to the `point_standar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."point_standar" ADD COLUMN     "point" INTEGER NOT NULL;
