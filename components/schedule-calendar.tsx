"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, FileEdit, Clock } from "lucide-react"
import type { Game } from "@/lib/types"

interface ScheduleCalendarProps {
  games: Game[]
  onGameClick: (game: Game) => void
  onMemoClick: (game: Game) => void
}

export default function ScheduleCalendar({ games, onGameClick, onMemoClick }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    const futureGame = games.find((g) => new Date(g.date) >= now)
    if (futureGame) {
      const d = new Date(futureGame.date)
      return new Date(d.getFullYear(), d.getMonth(), 1)
    }
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDayGames, setSelectedDayGames] = useState<Game[]>([])
  const [selectedDayLabel, setSelectedDayLabel] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthGames = games.filter((game) => {
    const d = new Date(game.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const gamesByDate = new Map<number, Game[]>()
  monthGames.forEach((game) => {
    const day = new Date(game.date).getDate()
    if (!gamesByDate.has(day)) gamesByDate.set(day, [])
    gamesByDate.get(day)!.push(game)
  })

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const weeks: (number | null)[][] = []
  let week: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) week.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const isPast = (day: number) => {
    const d = new Date(year, month, day, 23, 59, 59)
    return d < today
  }

  const formatTime = (dateString: string) => {
    const d = new Date(dateString)
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]})`
  }

  const getOpponentColor = (opponent: string) => {
    const colors: Record<string, string> = {
      롯데: "bg-red-500",
      두산: "bg-gray-700",
      NC: "bg-blue-400",
      LG: "bg-red-600",
      SSG: "bg-red-400",
      한화: "bg-orange-500",
      키움: "bg-pink-600",
      KIA: "bg-red-700",
      KT: "bg-black",
    }
    return colors[opponent] || "bg-blue-600"
  }

  const handleDayClick = (day: number) => {
    const dayGames = gamesByDate.get(day) || []
    if (dayGames.length > 0) {
      const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
      const d = new Date(year, month, day)
      setSelectedDayLabel(`${month + 1}월 ${day}일 (${dayNames[d.getDay()]})`)
      setSelectedDayGames(dayGames)
      setIsPopupOpen(true)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-blue-800">
              {year}년 {month + 1}월
            </h2>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-medium py-1 ${
                  i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-600"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {weeks.map((w, wi) =>
              w.map((day, di) => {
                if (day === null) {
                  return <div key={`${wi}-${di}`} className="min-h-[60px]" />
                }

                const dayGames = gamesByDate.get(day) || []
                const hasGame = dayGames.length > 0
                const past = isPast(day)

                return (
                  <div
                    key={`${wi}-${di}`}
                    className={`min-h-[60px] border rounded p-0.5 ${
                      isToday(day)
                        ? "border-blue-500 bg-blue-50"
                        : hasGame
                          ? "border-gray-300 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100"
                          : "border-gray-100 bg-gray-50"
                    } ${past && !hasGame ? "opacity-40" : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div
                      className={`text-xs font-medium mb-0.5 ${
                        di === 0 ? "text-red-500" : di === 6 ? "text-blue-500" : "text-gray-700"
                      } ${isToday(day) ? "font-bold" : ""}`}
                    >
                      {day}
                    </div>
                    {dayGames.map((game) => (
                      <div
                        key={game.id}
                        className={`rounded px-0.5 py-0.5 mb-0.5 text-white text-[10px] leading-tight ${getOpponentColor(game.opponent)} ${past ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{game.opponent}</span>
                          {game.memo?.attendees && game.memo.attendees.length > 0 && (
                            <FileEdit className="h-2.5 w-2.5 flex-shrink-0 text-yellow-300" />
                          )}
                        </div>
                        <div className="opacity-90">{formatTime(game.date)}</div>
                      </div>
                    ))}
                  </div>
                )
              }),
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t">
            {Array.from(new Set(monthGames.map((g) => g.opponent))).map((opp) => (
              <Badge key={opp} className={`${getOpponentColor(opp)} text-[10px] py-0`}>
                {opp}
              </Badge>
            ))}
            {monthGames.length === 0 && (
              <span className="text-xs text-gray-400">이 달에는 홈경기가 없습니다.</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 날짜 클릭 팝업 */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-blue-800">{selectedDayLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {selectedDayGames.map((game) => (
              <div key={game.id} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getOpponentColor(game.opponent)} text-xs`}>
                      vs {game.opponent}
                    </Badge>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(game.date)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-8 px-3 ${game.memo?.attendees?.length ? "text-red-500 border-red-500" : "text-blue-500 border-blue-500"}`}
                    onClick={() => {
                      setIsPopupOpen(false)
                      onMemoClick(game)
                    }}
                  >
                    <FileEdit className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">메모</span>
                  </Button>
                </div>

                {game.preBookingDate && (
                  <div className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">
                    선예매: {formatDate(game.preBookingDate)} {formatTime(game.preBookingDate)}
                  </div>
                )}

                {game.memo?.attendees && game.memo.attendees.length > 0 && (
                  <div className="text-xs bg-purple-50 rounded px-2 py-1.5 space-y-0.5">
                    {game.memo.attendees.map((att, i) => (
                      <div key={i} className="flex justify-between text-purple-700">
                        <span>{att.name}</span>
                        <span>{att.ticketCount}매</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium text-purple-800 border-t border-purple-200 pt-1 mt-1">
                      <span>합계</span>
                      <span>{game.memo.attendees.reduce((sum, a) => sum + a.ticketCount, 0)}매</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
