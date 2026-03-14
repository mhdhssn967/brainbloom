import { useState, useEffect, useCallback } from "react";
import { syncSchoolQuestions, getLastSyncTime } from "./sync";
import useSchoolStore from "@/store/useSchoolStore";

export const SYNC_STATE = {
  IDLE:    "idle",
  SYNCING: "syncing",
  SYNCED:  "synced",
  OFFLINE: "offline",
  ERROR:   "error",
};

export function useSyncStatus() {
  const { schoolData } = useSchoolStore();

  const [state, setState]       = useState(SYNC_STATE.IDLE);
  const [progress, setProgress] = useState({ synced: 0, total: 0, current: "" });
  const [result, setResult]     = useState(null);   // { added, updated, removed }
  const [lastSync, setLastSync] = useState(null);
  const [error, setError]       = useState(null);

  const runSync = useCallback(async () => {
    if (!schoolData?.id) return;
    if (!navigator.onLine) {
      setState(SYNC_STATE.OFFLINE);
      return;
    }

    setState(SYNC_STATE.SYNCING);
    setError(null);
    setProgress({ synced: 0, total: 0, current: "" });

    try {
      const res = await syncSchoolQuestions(
        schoolData.id,
        (p) => setProgress(p)
      );

      setResult(res);
      setState(SYNC_STATE.SYNCED);

      const ts = await getLastSyncTime();
      setLastSync(ts);
    } catch (err) {
      console.error("Sync failed:", err);
      setError(err.message);
      setState(SYNC_STATE.ERROR);
    }
  }, [schoolData?.id]);

  // Run on mount + when network reconnects
  useEffect(() => {
    runSync();

    const handleOnline = () => runSync();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [runSync]);

  // Load last sync time on mount
  useEffect(() => {
    getLastSyncTime().then(setLastSync);
  }, []);

  return {
    state,
    progress,
    result,
    lastSync,
    error,
    manualSync: runSync,
  };
}