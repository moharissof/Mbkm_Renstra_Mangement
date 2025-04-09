/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

export type NotificationDropdownProps = {
  userId: string;
};

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/notification?userId=${userId}&limit=5`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      setNotifications(data.serializedNotification || []);
      setUnreadCount(data.serializedUnreadCount || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch and setup polling
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    // Fetch immediately when dropdown opens
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      });

      if (!response.ok) throw new Error("Failed to mark as read");

      setNotifications(
        notifications.map((n : any) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to mark all as read");

      setNotifications(notifications.map((n : any) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "Approval":
        return "bg-green-500";
      case "Rejection":
        return "bg-red-500";
      case "ProgressUpdate":
        return "bg-blue-500";
      case "Comment":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case "Approval":
        return "menyetujui";
      case "Rejection":
        return "menolak";
      case "ProgressUpdate":
        return "memperbarui";
      case "Comment":
        return "mengomentari";
      default:
        return "membuat";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
        <Bell className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg z-50 border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || isLoading}
              >
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer",
                    !notification.is_read && "bg-blue-50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full overflow-hidden border">
                        <Image
                          src={notification.sender.photo || "/images/orang.png"}
                          alt={notification.sender.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                          getStatusColor(notification.type)
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {notification.sender.name}
                        </span>{" "}
                        <span className="text-gray-600">
                          {getActionText(notification.type)}
                        </span>{" "}
                        <span className="font-medium">
                          {notification.title}
                        </span>
                      </p>
                      {notification.message && (
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {notification.related_entity && (
                          <>
                            <span className="text-xs text-gray-500 capitalize">
                              {notification.related_entity.toLowerCase()}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                          </>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            { addSuffix: true }
                          )}
                        </span>
                        {!notification.is_read && (
                          <span className="ml-auto text-xs font-medium text-blue-600">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t">
            <Link href="/notifications" passHref>
              <Button
                variant="ghost"
                className="w-full text-center py-2"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
