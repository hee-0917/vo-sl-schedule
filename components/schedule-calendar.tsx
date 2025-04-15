"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { gameSchedule } from "@/lib/data"
import GameDetailDialog from "./game-detail-dialog"
import type { Game } from "@/lib/types"

export default function ScheduleCalendar() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 날짜에 경기가 있는지 확인하는 함수
  const hasGameOnDate = (date: Date) => {
    if (!date) return false
    const dateString = date.toISOString().split("T")[0]
    return gameSchedule.some((game) => game.date.split("T")[0] === dateString)
  }

  // 날짜에 선예매가 가능한지 확인하는 함수
  const hasPreBookingOnDate = (date: Date) => {
    if (!date) return false
    const dateString = date.toISOString().split("T")[0]
    return gameSchedule.some((game) => game.preBookingDate && game.preBookingDate.split("T")[0] === dateString)
  }

  // 날짜에 해당하는 경기 정보를 가져오는 함수
  const getGamesOnDate = (date: Date) => {
    if (!date) return []
    const dateString = date.toISOString().split("T")[0]
    return gameSchedule.filter((game) => game.date.split("T")[0] === dateString)
  }

  // 날짜에 해당하는 선예매 경기 정보를 가져오는 함수
  const getPreBookingGamesOnDate = (date: Date) => {
    if (!date) return []
    const dateString = date.toISOString().split("T")[0]
    return gameSchedule.filter((game) => game.preBookingDate && game.preBookingDate.split("T")[0] === dateString)
  }

  // 날짜 셀 렌더링 함수
  const renderDay = (day: Date | undefined) => {
    if (!day) return null

    const hasGame = hasGameOnDate(day)
    const hasPreBooking = hasPreBookingOnDate(day)
    const dayOfWeek = day.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const dayColor = dayOfWeek === 0 ? "text-red-500" : dayOfWeek === 6 ? "text-blue-500" : ""

    return (
      <div className="relative w-full h-full">
        <div className={`absolute top-0 left-0 ${dayColor}`}>{day.getDate()}</div>
        <div className="absolute top-0 right-0">
          {hasGame && <Badge className="bg-blue-600 hover:bg-blue-700">경기</Badge>}
          {hasPreBooking && <Badge className="bg-green-600 hover:bg-green-700 ml-1">예매</Badge>}
        </div>
      </div>
    )
  }

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date | undefined) => {
    if (!date) return

    const games = getGamesOnDate(date)
    const preBookingGames = getPreBookingGamesOnDate(date)

    if (games.length > 0) {
      setSelectedGame(games[0])
      setIsDialogOpen(true)
    } else if (preBookingGames.length > 0) {
      setSelectedGame(preBookingGames[0])
      setIsDialogOpen(true)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Badge className="bg-blue-600">경기일</Badge>
            <Badge className="bg-green-600">선예매일</Badge>
          </div>
        </div>
        <Calendar
          mode="single"
          onDayClick={handleDateClick}
          components={{
            Day: ({ day, ...props }) => (
              <div {...props} onClick={() => handleDateClick(day)}>
                {day && day.getDate()}
                {renderDay(day)}
              </div>
            ),
          }}
          className="rounded-md border"
        />
        {selectedGame && (
          <GameDetailDialog game={selectedGame} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        )}
      </CardContent>
    </Card>
  )
}
