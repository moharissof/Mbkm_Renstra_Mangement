/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 5;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get both personal and broadcast notifications for this user
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [{ recipient_id: userId }, { is_broadcast: true }],
      },
      include: {
        sender: {
          select: {
            name: true,
            photo: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });

    // Count unread notifications for this user
    const unreadCount = await prisma.notification.count({
      where: {
        OR: [{ recipient_id: userId }, { is_broadcast: true }],
        is_read: false,
      },
    });
    const serializedNotification = serializeBigInt(notifications);
    const serializedUnreadCount = serializeBigInt(unreadCount);
    console.log("Serialized Notification:", serializedNotification);
    console.log("Serialized Unread Count:", serializedUnreadCount);
    return NextResponse.json({ serializedNotification, serializedUnreadCount });
  } catch (error : any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const { id, userId } = await request.json()
  
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }
  
      // Verifikasi notifikasi milik user sebelum update
      const notification = await prisma.notification.findFirst({
        where: {
          id,
          OR: [
            { recipient_id: userId },
            { is_broadcast: true }
          ]
        }
      })
  
      if (!notification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
      }
  
      // Mark notification as read
      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          is_read: true,
          read_at: new Date(),
        },
      })
  
      return NextResponse.json(updatedNotification)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      )
    }
  }
  
  export async function PATCH(request: Request) {
    try {
      const { userId } = await request.json()
  
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }
  
      // Mark all user's notifications as read
      const { count } = await prisma.notification.updateMany({
        where: {
          OR: [
            { recipient_id: userId },
            { is_broadcast: true }
          ],
          is_read: false,
        },
        data: {
          is_read: true,
          read_at: new Date(),
        },
      })
  
      return NextResponse.json({ 
        success: true,
        markedCount: count
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      )
    }
  }