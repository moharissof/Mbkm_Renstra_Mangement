/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { CommentUser, Comment } from "@/types/reports"

export default function CommentList({ reportId }: { reportId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
        const res = await fetch(`${baseUrl}/api/comments?reportId=${reportId}`)

        if (!res.ok) throw new Error(`Gagal mengambil komentar (${res.status})`)

        const data = await res.json()
        
        // Proses komentar dengan fallback yang komprehensif
        const processedComments = data.map((comment: any) => {
          // Generate fallback ID jika kosong
          const id = comment.id 
            ? typeof comment.id === 'bigint' 
              ? comment.id.toString() 
              : comment.id
            : Math.random().toString(36).substring(2, 9)

          // Pastikan objek users ada dengan default yang aman
          const users = {
            id: comment.users?.id || 'pengguna-tidak-dikenal',
            name: comment.users?.name || 'Pengguna Tidak Dikenal',
            photo: comment.users?.photo || null
          }

          // Parse tanggal dengan aman
          let created_at: Date | null = null
          try {
            created_at = comment.created_at ? new Date(comment.created_at) : null
            if (created_at && isNaN(created_at.getTime())) created_at = null
          } catch (e) {
            console.warn("Format tanggal tidak valid:", comment.created_at)
            created_at = null
          }

          return {
            ...comment,
            id,
            program_kerja_id: comment.program_kerja_id?.toString() || '',
            laporan_id: comment.laporan_id?.toString() || '',
            created_at,
            updated_at: comment.updated_at ? new Date(comment.updated_at) : null,
            users
          }
        })

        setComments(processedComments)
        setError(null)
      } catch (error) {
        console.error("Error saat mengambil komentar:", error)
        setError("Gagal memuat komentar. Silakan coba lagi.")
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    if (reportId) fetchComments()
  }, [reportId])

  const formatDate = (date?: string | Date | null): string => {
    if (!date) return "beberapa waktu lalu"
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return "beberapa waktu lalu"
      return formatDistanceToNow(dateObj, { 
        addSuffix: true,
        locale: id // Gunakan lokal bahasa Indonesia
      })
    } catch {
      return "beberapa waktu lalu"
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-3 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Avatar className="h-6 w-6 animate-pulse">
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="bg-muted p-2 rounded-md h-16 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-3 text-center text-destructive">
        {error}
      </div>
    )
  }

  if (!comments.length) {
    return (
      <div className="px-6 py-3 text-center text-muted-foreground">
        Belum ada komentar
      </div>
    )
  }

  return (
    <div className="px-6 py-3 space-y-3">
      {comments.map((comment) => {
        // Dapatkan ID komentar dengan aman
        const commentId = comment.id?.toString() || Math.random().toString(36).substring(2, 9)
        
        return (
          <div key={commentId} className="flex items-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage 
                src={comment.users?.photo || undefined} 
                alt={comment.users?.name || 'Pengguna'} 
              />
              <AvatarFallback>
                {(comment.users?.name?.charAt(0) || 'P').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted p-2 rounded-md">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm">
                    {comment.users?.name || 'Pengguna Tidak Dikenal'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.comment || ''}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}