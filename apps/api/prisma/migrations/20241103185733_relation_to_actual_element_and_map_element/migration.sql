/*
  Warnings:

  - Added the required column `thumbnail` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Made the column `elementId` on table `MapElement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MapElement" ALTER COLUMN "elementId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MapElement" ADD CONSTRAINT "MapElement_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
