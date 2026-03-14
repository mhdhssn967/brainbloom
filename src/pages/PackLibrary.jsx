import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, BookOpen, Hash, GraduationCap,
  User, Gamepad2, ChevronDown, ChevronUp, ArrowLeft,
  CheckCircle2, X, FileQuestion, Loader2,
  Layers, AlignLeft,
} from "lucide-react";
import { getAllSetsForSchool } from "@/offline/db";
import useSchoolStore from "@/store/useSchoolStore";

const TYPE_META = {
  type1: {
    label:  "Classic Quiz",
    color:  "#6366F1",
    light:  "#EEF2FF",
    games:  ["Balloon Battle", "Zombie Blast", "Frog Catch", "Track Rush"],
  },
  type2: {
    label:  "Sort & Catch",
    color:  "#16A34A",
    light:  "#F0FDF4",
    games:  ["Chameleon Catch"],
  },
  type3: {
    label:  "Sentence Builder",
    color:  "#D97706",
    light:  "#FFFBEB",
    games:  ["Grammar Bridge"],
  },
};

const DIFF_COLOR = {
  easy:   { text: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  medium: { text: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  hard:   { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
};

export default function PackLibrary() {
  const navigate = useNavigate();
  const { schoolData } = useSchoolStore();

  const [sets, setSets]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [collapsed, setCollapsed]   = useState({});
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    getAllSetsForSchool(schoolData.id).then((data) => {
      setSets(data);
      setLoading(false);
    });
  }, []);

  const filtered = sets.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.title?.toLowerCase().includes(q) ||
      s.packId?.toString().includes(q) ||
      s.teacherName?.toLowerCase().includes(q) ||
      s.subject?.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  const grouped = filtered.reduce((acc, s) => {
    const key = s.subject || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const totalQuestions = sets.reduce(
    (acc, s) => acc + (s.questions?.length || 0), 0
  );

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#F8F9FC",
      fontFamily: "'Nunito', sans-serif",
      color: "#1E1E2E",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F1F1F1; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 999px; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideRight {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "14px 28px",
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#F3F4F6",
            border: "1px solid #E5E7EB",
            borderRadius: 10, padding: "7px 14px",
            fontSize: 13, fontWeight: 800,
            color: "#374151", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: 18, fontWeight: 900,
            color: "#111827", margin: 0,
          }}>
            Pack Library
          </h1>
          <p style={{
            fontSize: 12, color: "#9CA3AF",
            fontWeight: 700, margin: 0,
          }}>
            {sets.length} packs · {totalQuestions} questions · {schoolData?.name}
          </p>
        </div>

        {/* Type filters */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "all",   label: "All Types" },
            { key: "type1", label: "Classic Quiz" },
            { key: "type2", label: "Sort & Catch" },
            { key: "type3", label: "Sentence Builder" },
          ].map((f) => {
            const tm = TYPE_META[f.key];
            const active = typeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontSize: 12, fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  border: active
                    ? `1.5px solid ${tm?.color ?? "#6366F1"}`
                    : "1.5px solid #E5E7EB",
                  background: active
                    ? (tm?.light ?? "#EEF2FF")
                    : "#fff",
                  color: active
                    ? (tm?.color ?? "#6366F1")
                    : "#9CA3AF",
                  transition: "all 0.15s ease",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        display: "flex",
        height: "calc(100vh - 65px)",
        overflow: "hidden",
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: selected ? 440 : "100%",
          flexShrink: 0,
          overflowY: "auto",
          padding: "20px 24px 40px",
          borderRight: selected ? "1px solid #E5E7EB" : "none",
          transition: "width 0.25s ease",
          background: "#F8F9FC",
        }}>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 18 }}>
            <Search size={15} style={{
              position: "absolute", left: 13,
              top: "50%", transform: "translateY(-50%)",
              color: "#9CA3AF",
            }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, pack ID, teacher or subject..."
              style={{
                width: "100%",
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                borderRadius: 12,
                padding: "11px 36px 11px 38px",
                fontSize: 14, fontWeight: 700,
                color: "#111827", outline: "none",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 12,
                  top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", color: "#9CA3AF", padding: 4,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", paddingTop: 80, gap: 12,
            }}>
              <Loader2 size={28} style={{
                color: "#6366F1",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#9CA3AF", fontSize: 14, fontWeight: 700 }}>
                Loading packs...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", paddingTop: 80, gap: 10,
            }}>
              <div style={{
                width: 56, height: 56,
                background: "#F3F4F6",
                borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FileQuestion size={28} style={{ color: "#D1D5DB" }} />
              </div>
              <p style={{
                color: "#9CA3AF", fontSize: 14,
                fontWeight: 700, textAlign: "center",
              }}>
                {search ? "No packs match your search" : "No packs synced yet"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Object.entries(grouped).map(([subject, subjectSets]) => {
                const isCollapsed = collapsed[subject];
                return (
                  <div
                    key={subject}
                    style={{
                      background: "#fff",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      animation: "fadeUp 0.25s ease both",
                    }}
                  >
                    {/* Subject header */}
                    <button
                      onClick={() => setCollapsed(p => ({ ...p, [subject]: !p[subject] }))}
                      style={{
                        width: "100%",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        padding: "13px 18px",
                        background: "#FAFAFA",
                        border: "none",
                        borderBottom: isCollapsed ? "none" : "1px solid #F3F4F6",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 30, height: 30,
                          background: "#EEF2FF",
                          borderRadius: 8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <BookOpen size={14} style={{ color: "#6366F1" }} />
                        </div>
                        <span style={{
                          fontSize: 15, fontWeight: 900,
                          color: "#111827",
                        }}>
                          {subject}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 800,
                          color: "#6B7280",
                          background: "#F3F4F6",
                          borderRadius: 999, padding: "2px 8px",
                        }}>
                          {subjectSets.length} pack{subjectSets.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {isCollapsed
                        ? <ChevronDown size={16} style={{ color: "#9CA3AF" }} />
                        : <ChevronUp   size={16} style={{ color: "#9CA3AF" }} />
                      }
                    </button>

                    {/* Pack rows */}
                    {!isCollapsed && (
                      <div>
                        {subjectSets.map((set, si) => {
                          const tm = TYPE_META[set.type];
                          const isActive = selected?.packId === set.packId;
                          return (
                            <button
                              key={set.packId}
                              onClick={() => setSelected(isActive ? null : set)}
                              style={{
                                width: "100%",
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "12px 18px",
                                background: isActive ? "#F5F3FF" : "transparent",
                                border: "none",
                                borderTop: si > 0 ? "1px solid #F9FAFB" : "none",
                                borderLeft: `3px solid ${isActive ? tm?.color ?? "#6366F1" : "transparent"}`,
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "background 0.15s ease",
                              }}
                            >
                              {/* Type pill */}
                              <span style={{
                                fontSize: 10, fontWeight: 900,
                                color: tm?.color ?? "#6366F1",
                                background: tm?.light ?? "#EEF2FF",
                                border: `1px solid ${tm?.color ?? "#6366F1"}30`,
                                borderRadius: 6,
                                padding: "3px 7px",
                                flexShrink: 0,
                                letterSpacing: 0.3,
                              }}>
                                {tm?.label ?? set.type}
                              </span>

                              {/* Title + meta */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                  fontSize: 14, fontWeight: 800,
                                  color: isActive ? "#4F46E5" : "#111827",
                                  margin: 0,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}>
                                  {set.title}
                                </p>
                                <div style={{
                                  display: "flex", alignItems: "center",
                                  gap: 10, marginTop: 3,
                                }}>
                                  <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    color: "#9CA3AF",
                                    display: "flex", alignItems: "center", gap: 3,
                                  }}>
                                    <Hash size={10} />
                                    {set.packId}
                                  </span>
                                  <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    color: "#9CA3AF",
                                    display: "flex", alignItems: "center", gap: 3,
                                  }}>
                                    <User size={10} />
                                    {set.teacherName}
                                  </span>
                                  <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    color: "#9CA3AF",
                                    display: "flex", alignItems: "center", gap: 3,
                                  }}>
                                    <GraduationCap size={10} />
                                    {set.grade}
                                  </span>
                                </div>
                              </div>

                              {/* Q count */}
                              <div style={{
                                flexShrink: 0, textAlign: "center",
                                background: "#F3F4F6",
                                borderRadius: 8, padding: "4px 10px",
                              }}>
                                <p style={{
                                  fontSize: 15, fontWeight: 900,
                                  color: "#374151", margin: 0, lineHeight: 1,
                                }}>
                                  {set.questions?.length}
                                </p>
                                <p style={{
                                  fontSize: 9, fontWeight: 800,
                                  color: "#9CA3AF", margin: "2px 0 0",
                                  letterSpacing: 0.5, textTransform: "uppercase",
                                }}>
                                  Qs
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL — detail ── */}
        {selected && (
          <div style={{
            flex: 1, overflowY: "auto",
            background: "#fff",
            padding: "24px 28px 60px",
            animation: "slideRight 0.2s ease both",
            borderLeft: "1px solid #E5E7EB",
          }}>
            <PackDetail set={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── PackDetail ────────────────────────────────────────────────────────

function PackDetail({ set, onClose }) {
  const tm = TYPE_META[set.type];

  return (
    <div>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 20, gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: tm?.light ?? "#EEF2FF",
            border: `1px solid ${tm?.color ?? "#6366F1"}30`,
            borderRadius: 8, padding: "3px 10px",
            marginBottom: 8,
          }}>
            <Layers size={12} style={{ color: tm?.color }} />
            <span style={{
              fontSize: 11, fontWeight: 900,
              color: tm?.color, letterSpacing: 0.3,
            }}>
              {tm?.label}
            </span>
          </div>

          <h2 style={{
            fontSize: 20, fontWeight: 900,
            color: "#111827", margin: "0 0 10px",
            lineHeight: 1.3,
          }}>
            {set.title}
          </h2>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { icon: <Hash size={11} />,          label: `Pack #${set.packId}` },
              { icon: <BookOpen size={11} />,       label: set.subject           },
              { icon: <GraduationCap size={11} />,  label: set.grade             },
              { icon: <User size={11} />,           label: set.teacherName       },
            ].map((m, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 12, fontWeight: 700,
                color: "#374151",
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: 999, padding: "4px 10px",
              }}>
                <span style={{ color: "#9CA3AF" }}>{m.icon}</span>
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "#F3F4F6",
            border: "1px solid #E5E7EB",
            borderRadius: 10, padding: 8,
            cursor: "pointer", color: "#6B7280",
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Compatible games */}
      <div style={{
        background: tm?.light ?? "#EEF2FF",
        border: `1.5px solid ${tm?.color ?? "#6366F1"}25`,
        borderRadius: 14, padding: "12px 16px",
        marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <Gamepad2 size={15} style={{ color: tm?.color, flexShrink: 0 }} />
        <span style={{
          fontSize: 12, fontWeight: 800,
          color: "#374151",
        }}>
          Works with:
        </span>
        {tm?.games.map((g) => (
          <span key={g} style={{
            fontSize: 12, fontWeight: 800,
            color: tm?.color,
            background: "#fff",
            border: `1.5px solid ${tm?.color}30`,
            borderRadius: 8, padding: "3px 10px",
          }}>
            {g}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10, marginBottom: 16,
      }}>
        {[
          { label: "Questions", value: set.questions?.length ?? 0,                                           color: "#6366F1", bg: "#EEF2FF" },
          { label: "Easy",      value: set.questions?.filter(q => q.difficulty === "easy").length   ?? 0,    color: "#16A34A", bg: "#F0FDF4" },
          { label: "Medium",    value: set.questions?.filter(q => q.difficulty === "medium").length ?? 0,    color: "#D97706", bg: "#FFFBEB" },
          { label: "Hard",      value: set.questions?.filter(q => q.difficulty === "hard").length   ?? 0,    color: "#DC2626", bg: "#FEF2F2" },
        ].map((s) => (
          <div key={s.label} style={{
            background: s.bg,
            border: `1.5px solid ${s.color}20`,
            borderRadius: 12, padding: "12px 10px",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: 24, fontWeight: 900,
              color: s.color, margin: 0, lineHeight: 1,
            }}>
              {s.value}
            </p>
            <p style={{
              fontSize: 10, fontWeight: 800,
              color: s.color, margin: "4px 0 0",
              opacity: 0.7, letterSpacing: 0.5,
              textTransform: "uppercase",
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Remarks */}
      {set.remarks && (
        <div style={{
          background: "#FFFBEB",
          border: "1.5px solid #FDE68A",
          borderRadius: 12, padding: "10px 14px",
          marginBottom: 16,
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <AlignLeft size={14} style={{ color: "#D97706", marginTop: 2, flexShrink: 0 }} />
          <p style={{
            fontSize: 13, fontWeight: 700,
            color: "#92400E", margin: 0, fontStyle: "italic",
            lineHeight: 1.5,
          }}>
            {set.remarks}
          </p>
        </div>
      )}

      {/* Divider */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 14,
      }}>
        <p style={{
          fontSize: 11, fontWeight: 900,
          color: "#9CA3AF", letterSpacing: 1.5,
          textTransform: "uppercase", margin: 0,
          whiteSpace: "nowrap",
        }}>
          {set.questions?.length} Questions
        </p>
        <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
      </div>

      {/* Questions list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {set.questions?.map((q, i) => (
          <QuestionCard key={i} q={q} index={i} type={set.type} tm={tm} />
        ))}
      </div>
    </div>
  );
}

// ── QuestionCard ──────────────────────────────────────────────────────

function QuestionCard({ q, index, type, tm }) {
  const dm = DIFF_COLOR[q.difficulty] ?? DIFF_COLOR.medium;

  return (
    <div style={{
      background: "#FAFAFA",
      border: "1.5px solid #E5E7EB",
      borderRadius: 14, padding: "16px",
      animation: "fadeUp 0.2s ease both",
      animationDelay: `${index * 0.03}s`,
    }}>

      {/* Question header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 12,
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 26, height: 26,
          background: tm?.light ?? "#EEF2FF",
          borderRadius: 7,
          fontSize: 12, fontWeight: 900,
          color: tm?.color ?? "#6366F1",
        }}>
          {index + 1}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 800,
          color: dm.text, background: dm.bg,
          border: `1px solid ${dm.border}`,
          borderRadius: 999, padding: "2px 9px",
          textTransform: "capitalize",
        }}>
          {q.difficulty}
        </span>
      </div>

      {/* ── Type 1 ── */}
      {type === "type1" && (
        <>
          <p style={{
            fontSize: 15, fontWeight: 800,
            color: "#111827", margin: "0 0 12px",
            lineHeight: 1.5,
          }}>
            {q.question}
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          }}>
            {q.options?.map((opt, oi) => (
              <div key={oi} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: oi === q.correctIndex ? "#F0FDF4" : "#fff",
                border: `1.5px solid ${oi === q.correctIndex ? "#86EFAC" : "#E5E7EB"}`,
                borderRadius: 10, padding: "8px 12px",
              }}>
                {oi === q.correctIndex
                  ? <CheckCircle2 size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
                  : <div style={{
                      width: 14, height: 14, flexShrink: 0,
                      border: "2px solid #D1D5DB",
                      borderRadius: "50%",
                    }} />
                }
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: oi === q.correctIndex ? "#15803D" : "#374151",
                }}>
                  {opt}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Type 2 ── */}
      {type === "type2" && (
        <>
          <p style={{
            fontSize: 15, fontWeight: 800,
            color: "#111827", margin: "0 0 12px", lineHeight: 1.5,
          }}>
            {q.question}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <p style={{
                fontSize: 10, fontWeight: 900, letterSpacing: 1,
                color: "#16A34A", textTransform: "uppercase", marginBottom: 6,
              }}>
                ✓ Correct answers
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {q.correct?.map((c, i) => (
                  <span key={i} style={{
                    fontSize: 13, fontWeight: 700,
                    color: "#15803D",
                    background: "#F0FDF4",
                    border: "1.5px solid #86EFAC",
                    borderRadius: 8, padding: "4px 12px",
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p style={{
                fontSize: 10, fontWeight: 900, letterSpacing: 1,
                color: "#DC2626", textTransform: "uppercase", marginBottom: 6,
              }}>
                ✗ Wrong answers
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {q.wrong?.map((w, i) => (
                  <span key={i} style={{
                    fontSize: 13, fontWeight: 700,
                    color: "#9CA3AF",
                    background: "#F9FAFB",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 8, padding: "4px 12px",
                  }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Type 3 ── */}
      {type === "type3" && (
        <>
          <div style={{
            display: "flex", flexWrap: "wrap",
            gap: 5, marginBottom: 14, alignItems: "center",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 10, padding: "10px 12px",
          }}>
            {q.sentence?.map((word, wi) => (
              word === "___"
                ? <span key={wi} style={{
                    background: "#FFFBEB",
                    border: "1.5px solid #FDE68A",
                    borderRadius: 6, padding: "1px 10px",
                    fontSize: 14, fontWeight: 900,
                    color: "#D97706",
                  }}>
                    ___
                  </span>
                : <span key={wi} style={{
                    fontSize: 14, fontWeight: 700,
                    color: "#374151",
                  }}>
                    {word}
                  </span>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options?.map((opt, bi) => (
              <div key={bi} style={{
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                borderRadius: 10, padding: "10px 14px",
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 900, letterSpacing: 1,
                  color: "#D97706", textTransform: "uppercase", marginBottom: 8,
                }}>
                  Blank {bi + 1}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {opt.choices?.map((c, ci) => (
                    <span key={ci} style={{
                      fontSize: 13, fontWeight: 700,
                      color: c === opt.correct ? "#15803D" : "#6B7280",
                      background: c === opt.correct ? "#F0FDF4" : "#F9FAFB",
                      border: `1.5px solid ${c === opt.correct ? "#86EFAC" : "#E5E7EB"}`,
                      borderRadius: 8, padding: "4px 12px",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      {c === opt.correct && <CheckCircle2 size={11} />}
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}