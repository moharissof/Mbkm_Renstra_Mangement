-- CreateEnum
CREATE TYPE "public"."role" AS ENUM ('Admin', 'Ketua', 'Waket_1', 'Waket_2', 'Kabag', 'Staff_Kabag');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "nikp" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo" TEXT,
    "no_telp" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "jabatan_id" BIGINT,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bidang" (
    "id" BIGSERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jabatan" (
    "id" BIGSERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "role" "public"."role" NOT NULL,
    "parent_id" BIGINT,
    "bidang_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."periode_renstra" (
    "id" BIGSERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tahun_awal" INTEGER NOT NULL,
    "tahun_akhir" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "periode_renstra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_jabatan_id_fkey" FOREIGN KEY ("jabatan_id") REFERENCES "public"."jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jabatan" ADD CONSTRAINT "jabatan_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jabatan" ADD CONSTRAINT "jabatan_bidang_id_fkey" FOREIGN KEY ("bidang_id") REFERENCES "public"."bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
