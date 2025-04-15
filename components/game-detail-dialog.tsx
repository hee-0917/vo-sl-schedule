"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/lib/types"
import { CalendarIcon, Clock, MapPin, Ticket, Users } from "lucide-react"

interface GameDetailDialogProps {
  game: Game
  isOpen: boolean
  onClose: () => void
}

export default function GameDetailDialog({ game, isOpen, onClose }: GameDetailDialogProps) {
  // 날짜 포맷 함수를 수정합니다.
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "날짜 정보 없음"
      }

      const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
      const dayOfWeek = dayNames[date.getDay()]
      const dayColor = date.getDay() === 0 ? "text-red-500" : date.getDay() === 6 ? "text-blue-500" : ""

      return (
        <span>
          {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일{" "}
          <span className={dayColor}>({dayOfWeek})</span>
        </span>
      )
    } catch (error) {
      console.error("Date formatting error:", error)
      return "날짜 정보 오류"
    }
  }

  // 시간 포맷 함수
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "시간 정보 없음"
      }
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    } catch (error) {
      console.error("Time formatting error:", error)
      return "시간 정보 오류"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">경기 상세 정보</DialogTitle>
          <DialogDescription className="text-center">
            {game.isPreBooking ? "선예매 정보" : "경기 정보"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center items-center gap-4 text-xl font-bold">
            <span className="text-blue-800">삼성 라이온즈</span>
            <span>vs</span>
            <span>{game.opponent}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span>{formatDate(game.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{formatTime(game.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>{game.location}</span>
            </div>
            {game.preBookingDate && (
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-green-600" />
                <span>선예매일: {formatDate(game.preBookingDate)}</span>
              </div>
            )}
            {game.memo && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>
                  관람자: {game.memo.attendees} ({game.memo.ticketCount}매)
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {game.isSpecialGame && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                특별 경기
              </Badge>
            )}
          </div>

          {game.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
              <p className="font-medium mb-1">참고사항:</p>
              <p>{game.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
