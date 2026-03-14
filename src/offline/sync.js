import { getDocs, collection } from "firebase/firestore";
import { db as firestoreDb } from "@/firebase/config";
import {
  saveQuestionSet,
  getAllSetsForSchool,
  deleteSet,
  setMeta,
  getMeta,
} from "./db";

/**
 * Sync all question sets for a school from Firestore → IndexedDB
 * Only updates sets that are new or have been modified (by updatedAt)
 * Removes sets from IndexedDB that no longer exist in Firestore
 *
 * @param {string} schoolId
 * @param {function} onProgress  — called with { synced, total, current }
 * @returns {{ added, updated, removed, unchanged }}
 */
export async function syncSchoolQuestions(schoolId, onProgress) {
  // 1. Fetch all sets from Firestore
  const snap = await getDocs(
    collection(firestoreDb, "schools", schoolId, "questions")
  );

  const firestoreSets = snap.docs.map((d) => ({
    ...d.data(),
    id: d.id,
    packId: d.data().packId || d.id,
    schoolId,
  }));

  const total = firestoreSets.length;

  // 2. Get all currently cached sets for this school
  const cached = await getAllSetsForSchool(schoolId);
  const cachedMap = Object.fromEntries(cached.map((s) => [s.packId, s]));
  const firestoreIds = new Set(firestoreSets.map((s) => s.packId));

  let added = 0;
  let updated = 0;
  let unchanged = 0;

  // 3. Add or update
  for (let i = 0; i < firestoreSets.length; i++) {
    const set = firestoreSets[i];
    const cached = cachedMap[set.packId];
    const firestoreTs = set.updatedAt?.seconds ?? 0;
    const cachedTs = cached?.updatedAt ?? 0;

    onProgress?.({
      synced:  i + 1,
      total,
      current: set.title,
    });

    if (!cached) {
      await saveQuestionSet(set);
      added++;
    } else if (firestoreTs > cachedTs) {
      await saveQuestionSet(set);
      updated++;
    } else {
      unchanged++;
    }
  }

  // 4. Remove sets that no longer exist in Firestore
  let removed = 0;
  for (const cachedSet of cached) {
    if (!firestoreIds.has(cachedSet.packId)) {
      await deleteSet(cachedSet.packId);
      removed++;
    }
  }

  // 5. Save last sync timestamp
  await setMeta("lastSync", {
    timestamp: Date.now(),
    schoolId,
  });

  return { added, updated, removed, unchanged, total };
}

/**
 * Get the last sync time for display
 */
export async function getLastSyncTime() {
  const meta = await getMeta("lastSync");
  return meta?.timestamp ?? null;
}