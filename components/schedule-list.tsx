"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gameSchedule } from "@/lib/data"
import GameDetailDialog from "./game-detail-dialog"
import MemoDialog from "./memo-dialog"
import type { Game } from "@/lib/types"
import { CalendarIcon, Clock, MapPin, FileEdit, Trash2 } from "lucide-react"

export default function ScheduleList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("all")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMemoDialogOpen, setIsMemoDialogOpen] = useState(false)
  const [games, setGames] = useState<Game[]>(gameSchedule)

  // 로컬 스토리지에서 메모 데이터 로드
  useEffect(() => {
    const savedGames = localStorage.getItem("samsungLionsGames")
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames))
      } catch (e) {
        console.error("Failed to parse saved games", e)
      }
    }
  }, [])

  // 게임 데이터 저장
  const saveGames = (updatedGames: Game[]) => {
    setGames(updatedGames)
    localStorage.setItem("samsungLionsGames", JSON.stringify(updatedGames))
  }

  // 메모 저장
  const saveMemo = (gameId: string, attendees: string, ticketCount: number) => {
    const updatedGames = games.map((game) =>
      game.id === gameId ? { ...game, memo: { attendees, ticketCount } } : game,
    )
    saveGames(updatedGames)
    setIsMemoDialogOpen(false)
  }

  // 게임 삭제
  const deleteGame = (gameId: string) => {
    const updatedGames = games.filter((game) => game.id !== gameId)
    saveGames(updatedGames)
  }

  // 필터링된 경기 목록
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.location.toLowerCase().includes(searchTerm.toLowerCase())

    const gameMonth = new Date(game.date).getMonth() + 1
    const matchesMonth = monthFilter === "all" || gameMonth.toString() === monthFilter

    return matchesSearch && matchesMonth
  })

  // 경기 클릭 핸들러
  const handleGameClick = (game: Game) => {
    setSelectedGame(game)
    setIsDialogOpen(true)
  }

  // 메모 버튼 클릭 핸들러
  const handleMemoClick = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation()
    setSelectedGame(game)
    setIsMemoDialogOpen(true)
  }

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation()
    if (confirm("이 경기를 삭제하시겠습니까?")) {
      deleteGame(gameId)
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
      const dayColor = date.getDay() === 0 ? "text-red-500" : date.getDay() === 6 ? "text-blue-500" : ""

      return (
        <span>
          {date.getMonth() + 1}월 {date.getDate()}일 <span className={dayColor}>({dayOfWeek})</span>
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

  // 경기가 지난 경기인지 확인
  const isPastGame = (dateString: string) => {
    try {
      const gameDate = new Date(dateString)
      const today = new Date()
      return gameDate < today
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-lg">경기 일정 목록</CardTitle>
          <div className="flex flex-col gap-2 mt-2">
            <Input
              placeholder="팀명 또는 장소로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm"
            />
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="월 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 월</SelectItem>
                <SelectItem value="3">3월</SelectItem>
                <SelectItem value="4">4월</SelectItem>
                <SelectItem value="5">5월</SelectItem>
                <SelectItem value="6">6월</SelectItem>
                <SelectItem value="7">7월</SelectItem>
                <SelectItem value="8">8월</SelectItem>
                <SelectItem value="9">9월</SelectItem>
                <SelectItem value="10">10월</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Card
              key={game.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleGameClick(game)}
            >
              <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm font-medium">{formatDate(game.date)}</span>
                      <Clock className="h-3.5 w-3.5 text-gray-500 ml-1" />
                      <span className="text-sm">{formatTime(game.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-7 px-2 ${game.memo ? "text-red-500 border-red-500" : "text-blue-500 border-blue-500"}`}
                        onClick={(e) => handleMemoClick(e, game)}
                      >
                        <FileEdit className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">메모</span>
                      </Button>

                      {isPastGame(game.date) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-red-500 border-red-500 ml-1"
                          onClick={(e) => handleDeleteClick(e, game.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-bold text-blue-800 text-sm">삼성</span>
                    <span className="text-sm">vs</span>
                    <span className="font-bold text-sm">{game.opponent}</span>
                    <MapPin className="h-3.5 w-3.5 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">{game.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.preBookingDate && (
                      <Badge className="bg-green-600 text-xs py-0.5">선예매: {formatDate(game.preBookingDate)}</Badge>
                    )}
                    {game.memo && (
                      <Badge className="bg-purple-600 text-xs py-0.5">
                        {game.memo.attendees} ({game.memo.ticketCount}매)
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">검색 결과가 없습니다.</div>
        )}
      </div>

      {selectedGame && (
        <GameDetailDialog game={selectedGame} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      )}

      {selectedGame && (
        <MemoDialog
          game={selectedGame}
          isOpen={isMemoDialogOpen}
          onClose={() => setIsMemoDialogOpen(false)}
          onSave={saveMemo}
        />
      )}
    </div>
  )
}
