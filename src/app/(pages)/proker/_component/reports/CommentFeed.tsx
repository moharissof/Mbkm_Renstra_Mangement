/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale" // Impor lokal Indonesia
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

interface CommentUser {
  id: string
  name: string
  photo?: string | null
}

interface Comment {
  id: string
  comment: string
  created_at: string | Date
  users: CommentUser
}

interface CommentListProps {
  reportId: string
}

export default function CommentList({ reportId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
        const res = await fetch(`${baseUrl}/api/comments?reportId=${reportId}`)

        if (!res.ok) throw new Error("Gagal mengambil komentar")
        
        const data = await res.json()
        console.log("Respons API:", data) // Log debug
        
        setComments(
          data.map((comment: any) => ({
            ...comment,
            created_at: new Date(comment.created_at),
            users: {
              id: comment.users?.id || 'tidak-diketahui',
              name: comment.users?.name || 'Pengguna Tidak Dikenal',
              photo: comment.users?.photo || null
            }
          }))
        )
      } catch (error) {
        console.error("Error saat mengambil komentar:", error)
      } finally {
        setLoading(false)
      }
    }

    if (reportId) {
      fetchComments()
    }
  }, [reportId])

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return "beberapa waktu lalu"
      return formatDistanceToNow(dateObj, { 
        addSuffix: true,
        locale: id 
      })
    } catch {
      return "beberapa waktu lalu"
    }
  }

  if (loading) return <div className="px-6 py-3">Memuat komentar...</div>
  if (!comments.length) return <div className="px-6 py-3">Belum ada komentar</div>

  return (
    <div className="px-6 py-3 space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={comment.users.photo || undefined} alt={comment.users.name} />
            <AvatarFallback>
              {comment.users.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted p-2 rounded-md">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-sm">
                  {comment.users.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}