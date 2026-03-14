import { useSyncStatus, SYNC_STATE } from "@/offline/useSyncStatus";
import { Wifi, WifiOff, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function SyncBadge() {
  const { state, progress, result, lastSync, error, manualSync } = useSyncStatus();
  const [showDetail, setShowDetail] = useState(false);

  const formatTime = (ts) => {
    if (!ts) return "Never";
    const d = new Date(ts);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const config = {
    [SYNC_STATE.IDLE]: {
      bg:    "rgba(255,255,255,0.06)",
      border:"rgba(255,255,255,0.1)",
      color: "rgba(255,255,255,0.4)",
      icon:  <Wifi size={13} />,
      label: "Ready",
    },
    [SYNC_STATE.SYNCING]: {
      bg:    "rgba(129,140,248,0.15)",
      border:"rgba(129,140,248,0.4)",
      color: "#818CF8",
      icon: (
        <RefreshCw
          size={13}
          style={{ animation: "spinBadge 0.8s linear infinite" }}
        />
      ),
      label: progress.total > 0
        ? `Syncing ${progress.synced}/${progress.total}`
        : "Syncing...",
    },
    [SYNC_STATE.SYNCED]: {
      bg:    "rgba(34,197,94,0.12)",
      border:"rgba(34,197,94,0.35)",
      color: "#22C55E",
      icon:  <CheckCircle2 size={13} />,
      label: `Synced ${formatTime(lastSync)}`,
    },
    [SYNC_STATE.OFFLINE]: {
      bg:    "rgba(250,204,21,0.12)",
      border:"rgba(250,204,21,0.35)",
      color: "#FACC15",
      icon:  <WifiOff size={13} />,
      label: "Offline",
    },
    [SYNC_STATE.ERROR]: {
      bg:    "rgba(239,68,68,0.12)",
      border:"rgba(239,68,68,0.35)",
      color: "#EF4444",
      icon:  <AlertCircle size={13} />,
      label: "Sync failed",
    },
  };

  const c = config[state];

  return (
    <>
      <style>{`
        @keyframes spinBadge {
          to { transform: rotate(360deg); }
        }
        @keyframes badgePop {
          from { opacity: 0; transform: scale(0.9) translateY(4px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);   }
        }
      `}</style>

      <div style={{ position: "relative" }}>

        {/* Main pill */}
        <button
          onClick={() => setShowDetail((v) => !v)}
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         6,
            background:  c.bg,
            border:      `1px solid ${c.border}`,
            borderRadius: 999,
            padding:     "6px 12px",
            cursor:      "pointer",
            color:       c.color,
            fontSize:    24,
            fontWeight:  800,
            fontFamily:  "'Nunito', sans-serif",
            letterSpacing: 0.5,
            transition:  "all 0.2s ease",
            backdropFilter: "blur(8px)",
            animation:   "badgePop 0.3s ease both",
          }}
        >
          {c.icon}
          {c.label}
        </button>

        {/* Detail popover */}
        {showDetail && (
          <div style={{
            position:   "absolute",
            bottom:     "calc(100% + 10px)",
            right:      0,
            background: "#13131F",top:70,height:'fit-content',
            border:     "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding:    16,
            minWidth:   220,
            boxShadow:  "0 16px 40px rgba(0,0,0,0.6)",
            animation:  "badgePop 0.2s ease both",
            zIndex:     100,
          }}>

            <p style={{
              fontSize: 11,
              fontWeight: 800,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}>
              Sync Status
            </p>

            {/* Sync result summary */}
            {result && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 12,
              }}>
                {[
                  { label: "Total packs", value: result.total,     color: "#818CF8" },
                  { label: "Added",       value: result.added,     color: "#22C55E" },
                  { label: "Updated",     value: result.updated,   color: "#FACC15" },
                  { label: "Removed",     value: result.removed,   color: "#EF4444" },
                  { label: "Unchanged",   value: result.unchanged, color: "rgba(255,255,255,0.3)" },
                ].map((r) => (
                  <div key={r.label} style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                  }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                    }}>
                      {r.label}
                    </span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: r.color,
                    }}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Syncing progress */}
            {state === SYNC_STATE.SYNCING && progress.total > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}>
                  <span style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 700,
                  }}>
                    {progress.current}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: "#818CF8",
                    fontWeight: 800,
                  }}>
                    {progress.synced}/{progress.total}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  width: "100%",
                  height: 4,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${(progress.synced / progress.total) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #818CF8, #6366F1)",
                    borderRadius: 999,
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p style={{
                fontSize: 11,
                color: "#FCA5A5",
                fontWeight: 700,
                marginBottom: 12,
              }}>
                {error}
              </p>
            )}

            {/* Last sync time */}
            {lastSync && (
              <p style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                fontWeight: 700,
                marginBottom: 12,
              }}>
                Last synced at {new Date(lastSync).toLocaleTimeString("en-IN")}
              </p>
            )}

            {/* Manual sync button */}
            <button
              onClick={() => { manualSync(); setShowDetail(false); }}
              disabled={state === SYNC_STATE.SYNCING}
              style={{
                width:       "100%",
                background:  state === SYNC_STATE.SYNCING
                  ? "rgba(129,140,248,0.1)"
                  : "rgba(129,140,248,0.15)",
                border:      "1px solid rgba(129,140,248,0.3)",
                borderRadius: 10,
                padding:     "8px",
                color:       "#818CF8",
                fontSize:    12,
                fontWeight:  800,
                cursor:      state === SYNC_STATE.SYNCING ? "not-allowed" : "pointer",
                display:     "flex",
                alignItems:  "center",
                justifyContent: "center",
                gap:         6,
                fontFamily:  "'Nunito', sans-serif",
              }}
            >
              <RefreshCw
                size={13}
                style={state === SYNC_STATE.SYNCING
                  ? { animation: "spinBadge 0.8s linear infinite" }
                  : {}
                }
              />
              {state === SYNC_STATE.SYNCING ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}