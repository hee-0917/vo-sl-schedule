// Firebase 서비스 함수
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./config"
import type { Game, Attendee } from "@/lib/types"
import { gameSchedule } from "@/lib/data"

// 사용자 ID (실제로는 인증 후 사용자 ID를 사용)
const USER_ID = "default_user"

// 모든 경기 일정 가져오기 (초기 데이터 로드)
export async function initializeGames() {
  try {
    // 사용자 문서 확인
    const userDocRef = doc(db, "users", USER_ID)
    const userDoc = await getDoc(userDocRef)

    // 사용자 문서가 없으면 초기 데이터 설정
    if (!userDoc.exists()) {
      // 초기 데이터 설정
      await setDoc(userDocRef, { initialized: true })

      // 배치 작업으로 모든 게임 데이터 저장
      const batch = writeBatch(db)

      gameSchedule.forEach((game) => {
        const gameDocRef = doc(db, `users/${USER_ID}/games`, game.id)
        batch.set(gameDocRef, {
          ...game,
          date: Timestamp.fromDate(new Date(game.date)),
          preBookingDate: game.preBookingDate ? Timestamp.fromDate(new Date(game.preBookingDate)) : null,
        })
      })

      await batch.commit()
      console.log("초기 데이터 설정 완료")
    }

    // 게임 데이터 가져오기
    return await getAllGames()
  } catch (error) {
    console.error("초기화 오류:", error)
    // 오류 발생 시 로컬 데이터 반환
    return gameSchedule
  }
}

// 모든 경기 일정 가져오기
export async function getAllGames() {
  try {
    const gamesCollection = collection(db, `users/${USER_ID}/games`)
    const gamesSnapshot = await getDocs(gamesCollection)

    return gamesSnapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          date: data.date.toDate().toISOString(),
          preBookingDate: data.preBookingDate ? data.preBookingDate.toDate().toISOString() : null,
        } as Game
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error("게임 데이터 가져오기 오류:", error)
    // 오류 발생 시 로컬 데이터 반환
    return gameSchedule
  }
}

// 특정 월의 경기 일정 가져오기
export async function getGamesByMonth(month: number) {
  try {
    const startDate = new Date(2025, month - 1, 1)
    const endDate = new Date(2025, month, 0)

    const gamesCollection = collection(db, `users/${USER_ID}/games`)
    const q = query(
      gamesCollection,
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
    )

    const gamesSnapshot = await getDocs(q)

    return gamesSnapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          date: data.date.toDate().toISOString(),
          preBookingDate: data.preBookingDate ? data.preBookingDate.toDate().toISOString() : null,
        } as Game
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error("월별 게임 데이터 가져오기 오류:", error)
    // 오류 발생 시 해당 월의 로컬 데이터 반환
    return gameSchedule.filter((game) => {
      const gameDate = new Date(game.date)
      return gameDate.getMonth() + 1 === month
    })
  }
}

// 메모 업데이트
export async function updateGameMemo(gameId: string, attendees: Attendee[]) {
  try {
    const gameDocRef = doc(db, `users/${USER_ID}/games`, gameId)
    await updateDoc(gameDocRef, {
      memo: { attendees },
    })
    return true
  } catch (error) {
    console.error("메모 업데이트 오류:", error)
    return false
  }
}

// 게임 삭제
export async function deleteGame(gameId: string) {
  try {
    const gameDocRef = doc(db, `users/${USER_ID}/games`, gameId)
    await deleteDoc(gameDocRef)
    return true
  } catch (error) {
    console.error("게임 삭제 오류:", error)
    return false
  }
}
