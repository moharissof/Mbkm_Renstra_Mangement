-- CreateEnum
CREATE TYPE "role" AS ENUM ('Admin', 'Ketua', 'Waket_1', 'Waket_2', 'Kabag', 'Staff_Kabag');

-- CreateEnum
CREATE TYPE "bidang" AS ENUM ('SEMUA_BIDANG', 'BIDANG_1', 'BIDANG_2');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
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
CREATE TABLE "jabatan" (
    "id" BIGSERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "role" "role" NOT NULL,
    "parent_id" BIGINT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "bidang" "bidang" NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_jabatan_id_fkey" FOREIGN KEY ("jabatan_id") REFERENCES "jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jabatan" ADD CONSTRAINT "jabatan_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
