const DB_NAME = "brainbloom";
const DB_VERSION = 1;
const STORE_SETS = "questionSets";
const STORE_META = "meta";

// ── Open DB ──────────────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_SETS)) {
        const store = db.createObjectStore(STORE_SETS, { keyPath: "packId" });
        store.createIndex("schoolId",   "schoolId",   { unique: false });
        store.createIndex("type",       "type",       { unique: false });
        store.createIndex("teacherId",  "teacherId",  { unique: false });
        store.createIndex("subject",    "subject",    { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" });
      }
    };

    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// ── Generic helpers ──────────────────────────────────────────────────
function tx(db, storeName, mode, fn) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const req = fn(store);
    if (req) {
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror   = (e) => reject(e.target.error);
    } else {
      transaction.oncomplete = () => resolve();
      transaction.onerror    = (e) => reject(e.target.error);
    }
  });
}

// ── Question Sets ────────────────────────────────────────────────────

// Save or update a question set
export async function saveQuestionSet(set) {
  const db = await openDB();
  return tx(db, STORE_SETS, "readwrite", (store) =>
    store.put({
      packId:      set.packId || set.id,
      title:       set.title,
      subject:     set.subject,
      grade:       set.grade,
      type:        set.type,
      games:       set.games,
      questions:   set.questions,
      teacherName: set.teacherName,
      teacherId:   set.teacherId,
      schoolId:    set.schoolId,
      remarks:     set.remarks || "",
      updatedAt:   set.updatedAt?.seconds ?? 0,
    })
  );
}

// Get all sets for a school
export async function getAllSetsForSchool(schoolId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETS, "readonly");
    const store = transaction.objectStore(STORE_SETS);
    const index = store.index("schoolId");
    const req   = index.getAll(schoolId);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Get a single set by packId
export async function getSetByPackId(packId) {
  const db = await openDB();
  return tx(db, STORE_SETS, "readonly", (store) => store.get(packId));
}

// Get all sets for a specific game
export async function getSetsByGame(schoolId, gameId) {
  const all = await getAllSetsForSchool(schoolId);
  return all.filter((s) => s.games?.includes(gameId));
}

// Get all sets by teacher
export async function getSetsByTeacher(schoolId, teacherId) {
  const all = await getAllSetsForSchool(schoolId);
  return all.filter((s) => s.schoolId === schoolId && s.teacherId === teacherId);
}

// Delete a set
export async function deleteSet(packId) {
  const db = await openDB();
  return tx(db, STORE_SETS, "readwrite", (store) => store.delete(packId));
}

// ── Meta ─────────────────────────────────────────────────────────────

export async function setMeta(key, value) {
  const db = await openDB();
  return tx(db, STORE_META, "readwrite", (store) =>
    store.put({ key, value })
  );
}

export async function getMeta(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_META, "readonly");
    const store = transaction.objectStore(STORE_META);
    const req = store.get(key);
    req.onsuccess = (e) => resolve(e.target.result?.value ?? null);
    req.onerror   = (e) => reject(e.target.error);
  });
}