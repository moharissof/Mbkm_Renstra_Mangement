-- CreateTable
CREATE TABLE "public"."renstra" (
    "id" BIGSERIAL NOT NULL,
    "periode_id" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "renstra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sub_renstra" (
    "id" BIGSERIAL NOT NULL,
    "renstra_id" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sub_renstra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."point_renstra" (
    "id" BIGSERIAL NOT NULL,
    "renstra_id" BIGINT NOT NULL,
    "sub_renstra_id" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "presentase" DOUBLE PRECISION,
    "bidang_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "point_renstra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."renstra" ADD CONSTRAINT "renstra_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "public"."periode_renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sub_renstra" ADD CONSTRAINT "sub_renstra_renstra_id_fkey" FOREIGN KEY ("renstra_id") REFERENCES "public"."renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."point_renstra" ADD CONSTRAINT "point_renstra_renstra_id_fkey" FOREIGN KEY ("renstra_id") REFERENCES "public"."renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."point_renstra" ADD CONSTRAINT "point_renstra_sub_renstra_id_fkey" FOREIGN KEY ("sub_renstra_id") REFERENCES "public"."sub_renstra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."point_renstra" ADD CONSTRAINT "point_renstra_bidang_id_fkey" FOREIGN KEY ("bidang_id") REFERENCES "public"."bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
