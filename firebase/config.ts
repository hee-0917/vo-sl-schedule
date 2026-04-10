// Firebase 설정 파일
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

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

// Firebase 초기화 (중복 초기화 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export { app, db }
