// Firebase 설정 파일
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCdZyLb2I7pxM1ofZ6_Jpq5NEbrXfTlgGw",
  authDomain: "vo-sl-schedule.firebaseapp.com",
  databaseURL: "https://vo-sl-schedule-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vo-sl-schedule",
  storageBucket: "vo-sl-schedule.firebasestorage.app",
  messagingSenderId: "620204191574",
  appId: "1:620204191574:web:b22b94f99fb8ae7109b0f7",
  measurementId: "G-D57TKJZL81",
}

// Firebase 초기화
let app
let db
let auth

// 클라이언트 사이드에서만 Firebase 초기화
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.error("Firebase 초기화 오류:", error)
  }
}

export { app, db, auth }
