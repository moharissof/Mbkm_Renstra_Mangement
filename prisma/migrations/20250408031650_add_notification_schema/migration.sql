-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('System', 'Announcement', 'Approval', 'Rejection', 'ProgressUpdate', 'Comment');

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'System',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_broadcast" BOOLEAN NOT NULL DEFAULT false,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT,
    "related_entity" TEXT,
    "related_entity_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipient_id_is_read_idx" ON "public"."Notification"("recipient_id", "is_read");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "public"."Notification"("created_at");

-- CreateIndex
CREATE INDEX "Notification_is_broadcast_idx" ON "public"."Notification"("is_broadcast");

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
