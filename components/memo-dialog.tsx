"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { Game, Attendee } from "@/lib/types"

interface MemoDialogProps {
  game: Game
  isOpen: boolean
  onClose: () => void
  onSave: (gameId: string, attendees: Attendee[]) => void
}

export default function MemoDialog({ game, isOpen, onClose, onSave }: MemoDialogProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([{ name: "", ticketCount: 1 }])

  // 메모가 있으면 초기값 설정
  useEffect(() => {
    if (game.memo?.attendees && game.memo.attendees.length > 0) {
      setAttendees(game.memo.attendees)
    } else {
      setAttendees([{ name: "", ticketCount: 1 }])
    }
  }, [game])

  const handleSave = () => {
    // 빈 이름의 관람자는 제외
    const validAttendees = attendees.filter((attendee) => attendee.name.trim() !== "")
    onSave(game.id, validAttendees)
  }

  const handleNameChange = (index: number, name: string) => {
    const newAttendees = [...attendees]
    newAttendees[index].name = name
    setAttendees(newAttendees)
  }

  const handleTicketCountChange = (index: number, count: number) => {
    const newAttendees = [...attendees]
    newAttendees[index].ticketCount = count
    setAttendees(newAttendees)
  }

  const addAttendee = () => {
    setAttendees([...attendees, { name: "", ticketCount: 1 }])
  }

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      const newAttendees = [...attendees]
      newAttendees.splice(index, 1)
      setAttendees(newAttendees)
    }
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

          <div className="space-y-4">
            {attendees.map((attendee, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`attendee-${index}`} className="text-sm font-medium">
                    관람자 {index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttendee(index)}
                    disabled={attendees.length === 1}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    id={`attendee-${index}`}
                    placeholder="관람자 이름"
                    value={attendee.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                  />

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`ticket-${index}`} className="whitespace-nowrap">
                      티켓 매수:
                    </Label>
                    <Input
                      id={`ticket-${index}`}
                      type="number"
                      min="1"
                      value={attendee.ticketCount}
                      onChange={(e) => handleTicketCountChange(index, Number.parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" onClick={addAttendee} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              관람자 추가
            </Button>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <div className="flex gap-2">
            {game.memo?.attendees && game.memo.attendees.length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50"
                onClick={() => onSave(game.id, [])}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                삭제
              </Button>
            )}
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
              저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
