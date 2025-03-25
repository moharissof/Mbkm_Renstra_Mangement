-- CreateEnum
CREATE TYPE "public"."Status_Proker" AS ENUM ('Draft', 'Planning', 'Disetujui', 'Ditolak', 'Done');

-- CreateTable
CREATE TABLE "public"."periode_proker" (
    "id" BIGSERIAL NOT NULL,
    "tahun" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "periode_proker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."program_kerja" (
    "id" BIGSERIAL NOT NULL,
    "point_renstra_id" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "strategi_pencapaian" TEXT,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "baseline" TEXT,
    "waktu_mulai" TIMESTAMP(3) NOT NULL,
    "waktu_selesai" TIMESTAMP(3) NOT NULL,
    "anggaran" BIGINT,
    "volume" INTEGER NOT NULL,
    "status" "public"."Status_Proker" NOT NULL,
    "first_approval_status" TEXT,
    "status_periode_first" TEXT,
    "second_approval_status" TEXT,
    "status_periode_second" TEXT,
    "user_id" TEXT NOT NULL,
    "periode_proker_id" BIGINT NOT NULL,
    "alasan_penolakan" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "program_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."indikator_proker" (
    "id" BIGSERIAL NOT NULL,
    "proker_id" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "indikator_proker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."point_standar" (
    "id" BIGSERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "point_standar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_point_standarToprogram_kerja" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_point_standarToprogram_kerja_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "periode_proker_tahun_key" ON "public"."periode_proker"("tahun");

-- CreateIndex
CREATE INDEX "_point_standarToprogram_kerja_B_index" ON "public"."_point_standarToprogram_kerja"("B");

-- AddForeignKey
ALTER TABLE "public"."program_kerja" ADD CONSTRAINT "program_kerja_point_renstra_id_fkey" FOREIGN KEY ("point_renstra_id") REFERENCES "public"."point_renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."program_kerja" ADD CONSTRAINT "program_kerja_periode_proker_id_fkey" FOREIGN KEY ("periode_proker_id") REFERENCES "public"."periode_proker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."program_kerja" ADD CONSTRAINT "program_kerja_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."indikator_proker" ADD CONSTRAINT "indikator_proker_proker_id_fkey" FOREIGN KEY ("proker_id") REFERENCES "public"."program_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_point_standarToprogram_kerja" ADD CONSTRAINT "_point_standarToprogram_kerja_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."point_standar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_point_standarToprogram_kerja" ADD CONSTRAINT "_point_standarToprogram_kerja_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."program_kerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
