import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  orderBy,
  limit,
  DocumentData,
} from "firebase/firestore";

// Menulis skor ke Firestore
export const submitScoreToFirestore = async (playerName:string, score:number, streak:number) => {
  try {
    const leaderboardRef = collection(db, "leaderboard");
    const docRef = doc(leaderboardRef, playerName.toLowerCase());

    // Ambil data sebelumnya (jika ada)
    const existingRecordSnapshot = await getDocs(
      query(leaderboardRef, where("name", "==", playerName))
    );

    if (!existingRecordSnapshot.empty) {
      const existingRecord = existingRecordSnapshot.docs[0].data();

      // Perbarui hanya jika skor lebih tinggi
      if (score > existingRecord.score) {
        await setDoc(docRef, { name: playerName, score, streak });
        console.log("Record updated with a higher score.");
      } else {
        console.log("No update: new score is not higher.");
      }
    } else {
      // Tambahkan record baru
      await setDoc(docRef, { name: playerName, score, streak });
      console.log("Record added.");
    }
  } catch (error) {
    console.error("Error submitting score:", error);
  }
};

// Mendapatkan leaderboard
export const getLeaderboard = async (limitCount = 10) => {
  try {
    const leaderboardRef = collection(db, "leaderboard");
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const leaderboard: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });

    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
