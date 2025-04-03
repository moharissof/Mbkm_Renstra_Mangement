-- AlterTable
ALTER TABLE "public"."komentar" ADD COLUMN     "laporan_id" BIGINT;

-- AddForeignKey
ALTER TABLE "public"."komentar" ADD CONSTRAINT "komentar_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "public"."laporan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
