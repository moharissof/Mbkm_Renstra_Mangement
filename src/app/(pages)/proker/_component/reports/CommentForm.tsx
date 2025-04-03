"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"

interface CommentFormProps {
  programId: string
  userId: string
  reportId: string
}

export default function CommentForm({ programId, userId, reportId }: CommentFormProps) {
  const { toast } = useToast()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program_kerja_id: programId,
          user_id: userId,
          report_id: reportId,
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      setComment("")
      toast({
        title: "Success",
        description: "Komentar Berhasil Disubmit!.",
        variant: "success",
      })
      window.location.reload()
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start w-full gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" alt="Your avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="flex-1 flex gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-0 h-9 py-2 px-3 resize-none"
        />

        <Button type="submit" size="sm" variant="ghost" className="px-2" disabled={!comment.trim() || isSubmitting}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Kirim Komentar</span>
        </Button>
      </div>
    </form>
  )
}

