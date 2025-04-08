import { NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { NotificationType } from "@prisma/client"; // Import enum dari Prisma

export async function POST(request: Request) {
  try {
    const { title, message, type } = await request.json();

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'Title, message, and type are required' },
        { status: 400 }
      );
    }

    // Validasi enum type
    if (!Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { error: `Invalid notification type: ${type}` },
        { status: 400 }
      );
    }

    const notificationPush = await prisma.notification.create({
      data: {
        title,
        message,
        type, // Sudah sesuai enum
        is_broadcast: true,
        sender_id: "876ddf5a-acca-4891-83b8-25b486c5ae61",
      },
    });
    const notification = serializeBigInt(notificationPush); // Serialize BigInt values
    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Error in broadcast notification:', error);
    return NextResponse.json(
      {
        error: 'Failed to send broadcast',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
