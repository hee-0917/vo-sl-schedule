// Firebase 설정 파일
// 나중에 Firebase를 연결할 때 사용할 설정 파일입니다.

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Firebase 설정
// 실제 프로젝트에서는 환경 변수를 사용하세요
const firebaseConfig = {
  apiKey: "AIzaSyCdZyLb2I7pxM1ofZ6_Jpq5NEbrXfTlgGw",
  authDomain: "vo-sl-schedule.firebaseapp.com",
  projectId: "vo-sl-schedule",
  storageBucket: "vo-sl-schedule.firebasestorage.app",
  messagingSenderId: "620204191574",
  appId: "1:620204191574:web:b22b94f99fb8ae7109b0f7",
  measurementId: "G-D57TKJZL81"
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const analytics = getAnalytics(app)

export { app, db, auth, analytics }
