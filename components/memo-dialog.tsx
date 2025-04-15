"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Game } from "@/lib/types"

interface MemoDialogProps {
  game: Game
  isOpen: boolean
  onClose: () => void
  onSave: (gameId: string, attendees: string, ticketCount: number) => void
}

export default function MemoDialog({ game, isOpen, onClose, onSave }: MemoDialogProps) {
  const [attendees, setAttendees] = useState("")
  const [ticketCount, setTicketCount] = useState(1)

  // 메모가 있으면 초기값 설정
  useEffect(() => {
    if (game.memo) {
      setAttendees(game.memo.attendees)
      setTicketCount(game.memo.ticketCount)
    } else {
      setAttendees("")
      setTicketCount(1)
    }
  }, [game])

  const handleSave = () => {
    onSave(game.id, attendees, ticketCount)
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "날짜 정보 없음"
      }

      const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
      const dayOfWeek = dayNames[date.getDay()]

      return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayOfWeek})`
    } catch (error) {
      console.error("Date formatting error:", error)
      return "날짜 정보 오류"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">경기 메모</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center font-medium">
            {formatDate(game.date)} {game.opponent}전
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="attendees">관람자</Label>
              <Input
                id="attendees"
                placeholder="관람자 이름 (예: 홍길동, 가족)"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ticketCount">티켓 매수</Label>
              <Input
                id="ticketCount"
                type="number"
                min="1"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number.parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
