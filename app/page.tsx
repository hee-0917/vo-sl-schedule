import ScheduleList from "@/components/schedule-list"

export default function HomePage() {
  return (
    <div className="container mx-auto px-2 py-4 max-w-md">
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">삼성 라이온즈 2025 홈경기 일정</h1>
        <p className="text-sm text-gray-600">홈경기 일정 및 선예매 가능일을 확인하세요</p>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
          <p className="font-medium mb-1">※ 선예매 안내</p>
          <p>- 화/수/목 경기: 토요일 전 일요일 오후 2시</p>
          <p>- 금/토/일 경기: 토요일 전 수요일 오후 2시</p>
          <p className="mt-1 text-red-500 font-bold">⚠️ 무조건 선착순 예매!!</p>
          <p className="mt-1 text-blue-600">※ 4월 19일부터 토요일 경기는 오후 5시에 시작합니다.</p>
        </div>
      </header>

      <ScheduleList />
    </div>
  )
}
