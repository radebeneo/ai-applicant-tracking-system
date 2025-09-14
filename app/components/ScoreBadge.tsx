import React from "react";

type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  // Determine label and colors based on score
  const isStrong = score > 70;
  const isGood = !isStrong && score > 49;

  const label = isStrong ? "Strong" : isGood ? "Good Start" : "Needs Work";

  // Tailwind utility classes using theme colors defined in app.css
  // bg-badge-green/yellow/red and standard text color shades
  const bgClass = isStrong
    ? "bg-badge-green"
    : isGood
    ? "bg-badge-yellow"
    : "bg-badge-red";

  const textClass = isStrong
    ? "text-green-600"
    : isGood
    ? "text-yellow-600"
    : "text-red-600";

  return (
    <div className={`score-badge ${bgClass}`}>
      <p className={`text-sm font-medium ${textClass}`}>{label}</p>
    </div>
  );
};

export default ScoreBadge;
