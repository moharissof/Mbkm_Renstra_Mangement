// lib/notifications.ts
import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

export async function createNotification({
  title,
  message,
  type,
  senderId,
  recipientId,
  relatedEntity,
  relatedEntityId,
  isBroadcast = false,
}: {
  title: string
  message: string
  type: NotificationType
  senderId: string
  recipientId?: string
  relatedEntity?: string
  relatedEntityId?: number
  isBroadcast?: boolean
}) {
  return await prisma.notification.create({
    data: {
      title,
      message,
      type,
      sender_id: senderId,
      recipient_id: isBroadcast ? null : recipientId,
      is_broadcast: isBroadcast,
      related_entity: relatedEntity,
      related_entity_id: relatedEntityId,
    },
  })
}

// Example usage in your application:
// When a program kerja is approved:
/*
await createNotification({
  title: programKerja.nama,
  message: "Program kerja Anda telah disetujui",
  type: "Approval",
  senderId: approverId,
  recipientId: creatorId,
  relatedEntity: "ProgramKerja",
  relatedEntityId: programKerja.id,
})
*/