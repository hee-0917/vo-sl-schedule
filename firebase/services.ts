// Firebase 서비스 함수
import {
  collection,
  getDocs,
  doc,
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
    // 게임 데이터가 Firestore에 있는지 확인
    const gamesCollection = collection(db, `users/${USER_ID}/games`)
    const gamesSnapshot = await getDocs(gamesCollection)

    // 게임 데이터가 없으면 초기 데이터 업로드
    if (gamesSnapshot.empty) {
      console.log("Firestore에 게임 데이터 없음 → 업로드 시작")

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
      console.log("초기 데이터 업로드 완료:", gameSchedule.length, "건")
    }

    // 게임 데이터 가져오기
    return await getAllGames()
  } catch (error) {
    console.error("Firebase 초기화 오류:", error)
    // 오류 발생 시 로컬 데이터 반환
    return gameSchedule
  }
}

// 모든 경기 일정 가져오기
export async function getAllGames() {
  try {
    const gamesCollection = collection(db, `users/${USER_ID}/games`)
    const gamesSnapshot = await getDocs(gamesCollection)

    if (gamesSnapshot.empty) {
      return gameSchedule
    }

    return gamesSnapshot.docs
      .map((docSnap) => {
        const data = docSnap.data()
        return {
          ...data,
          id: docSnap.id,
          date: data.date.toDate().toISOString(),
          preBookingDate: data.preBookingDate ? data.preBookingDate.toDate().toISOString() : null,
        } as Game
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error("게임 데이터 가져오기 오류:", error)
    return gameSchedule
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

// 경기 결과 업데이트
export async function updateGameResult(gameId: string, result: "win" | "loss" | null) {
  try {
    const gameDocRef = doc(db, `users/${USER_ID}/games`, gameId)
    await updateDoc(gameDocRef, {
      result: result,
    })
    return true
  } catch (error) {
    console.error("경기 결과 업데이트 오류:", error)
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
