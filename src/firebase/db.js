import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./config";

// Get school data by UID
export const getSchoolByUid = async (uid) => {
  try {
    const q = query(collection(db, "schools"), where("uid", "==", uid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch {
    return null;
  }
};

// Get school data by email — fallback
export const getSchoolByEmail = async (email) => {
  try {
    const q = query(collection(db, "schools"), where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch {
    return null;
  }
};

// Fetch a question set by school ID + pack ID
export const getQuestionsByPackId = async (schoolId, packId) => {
  try {
    const ref = doc(db, "schools", schoolId, "questions", packId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch {
    return null;
  }
};

// Fetch all question sets for a game
export const getQuestionsByGame = async (schoolId, gameId) => {
  try {
    const q = query(
      collection(db, "schools", schoolId, "questions"),
      where("games", "array-contains", gameId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
};