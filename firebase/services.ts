// Firebase 서비스 함수
// 나중에 Firebase를 연결할 때 사용할 서비스 함수들입니다.

import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "./config"
import type { Game } from "@/lib/types"

// 모든 경기 일정 가져오기
export async function getAllGames() {
  const gamesCollection = collection(db, "games")
  const gamesSnapshot = await getDocs(gamesCollection)
  return gamesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Game[]
}

// 특정 월의 경기 일정 가져오기
export async function getGamesByMonth(month: number) {
  const gamesCollection = collection(db, "games")
  const startDate = new Date(2025, month - 1, 1)
  const endDate = new Date(2025, month, 0)

  const q = query(gamesCollection, where("date", ">=", startDate), where("date", "<=", endDate))

  const gamesSnapshot = await getDocs(q)
  return gamesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Game[]
}

// 새 경기 일정 추가하기
export async function addGame(game: Omit<Game, "id">) {
  const gamesCollection = collection(db, "games")
  const docRef = await addDoc(gamesCollection, game)
  return docRef.id
}

// 경기 일정 업데이트하기
export async function updateGame(id: string, gameData: Partial<Game>) {
  const gameRef = doc(db, "games", id)
  await updateDoc(gameRef, gameData)
}

// 경기 일정 삭제하기
export async function deleteGame(id: string) {
  const gameRef = doc(db, "games", id)
  await deleteDoc(gameRef)
}

// 메모 추가하기
export async function addNote(note: { content: string }) {
  const notesCollection = collection(db, "notes")
  const docRef = await addDoc(notesCollection, note)
  return docRef.id
}

// 메모 삭제하기
export async function deleteNote(id: string) {
  const noteRef = doc(db, "notes", id)
  await deleteDoc(noteRef)
}
