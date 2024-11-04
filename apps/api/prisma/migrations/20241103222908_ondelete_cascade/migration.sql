-- DropForeignKey
ALTER TABLE "MapElement" DROP CONSTRAINT "MapElement_mapId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceElement" DROP CONSTRAINT "SpaceElement_spaceId_fkey";

-- AddForeignKey
ALTER TABLE "SpaceElement" ADD CONSTRAINT "SpaceElement_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapElement" ADD CONSTRAINT "MapElement_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;
