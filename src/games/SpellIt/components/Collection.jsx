// Shows the collected SVG cards for one team
// When a new item is collected it animates in from the center
import { SPELL_IT_DATA } from "@/data/spellItData";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function Collection({ team, collection, side }) {

  const color = TEAM_COLORS[team?.id ?? 0];

  return (
    <div className="flex flex-col w-full px-3 pt-3 pb-2" style={{margin:'30px'}}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div style={{
          fontFamily:    "'Baloo 2', cursive",
          fontSize:      41,
          fontWeight:    900,
          color:         color,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}>
          Collection
        </div>
        <div style={{
          background:   `${color}25`,
          border:       `1.5px solid ${color}50`,
          borderRadius: 99,
          padding:      "1px 8px",
          fontSize:     11,
          fontWeight:   900,
          color,
        }}>
          {collection.length}
        </div>
      </div>

      {/* Collected items row */}
      <div className="flex flex-wrap gap-2">
        {collection.length === 0 ? (
          <div style={{
            fontSize:   10,
            color:      "rgba(255,255,255,0.2)",
            fontWeight: 700,
            fontStyle:  "italic",
          }}>
            None yet...
          </div>
        ) : (
          collection.map((item, i) => (
            <CollectedCard
              key={`${item.file}-${i}`}
              item={item}
              color={color}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}



function CollectedCard({ item, color, index }) {
  const folder = SPELL_IT_DATA[item.category]?.folder ?? item.category;
  const src    = `/assets/spellit/${folder}/${item.file}`;

  return (
    <div
      title={item.name}
      style={{
        width:          48,
        height:         48,
        borderRadius:   12,
        background:     `${color}15`,
        border:         `2px solid ${color}40`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
        animation:      "cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        animationDelay: `${index * 0.05}s`,
        boxShadow:      `0 4px 12px ${color}20`,
        flexShrink:     0,
      }}
    >
      <img
        src={src}
        alt={item.name}
        style={{ width:"80%", height:"80%", objectFit:"contain" }}
      />
    </div>
  );
}