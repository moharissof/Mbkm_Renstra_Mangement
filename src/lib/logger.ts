/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma'

type LogActionParams = {
  action: string
  entityType: string
  entityId: bigint
  userId: string
  description?: string
  oldData?: any
  newData?: any
  request?: Request
}

export const logAction = async ({
  action,
  entityType,
  entityId,
  userId,
  description,
  oldData,
  newData,
  request
}: LogActionParams) => {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for')
    const userAgent = request?.headers.get('user-agent')

    await prisma.activity_log.create({
      data: {
        action,
        entityType,
        entityId,
        oldData,
        newData,
        description: description || `${action} ${entityType}`,
        userId,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined
      }
    })
  } catch (error) {
    console.error('Failed to log action:', error)
  }
}