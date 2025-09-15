import React from 'react';

export type AtsSuggestion = {
  type: 'good' | 'improve';
  tip: string;
};

export type AtsProps = {
  score: number; // 0-100
  suggestions: AtsSuggestion[];
};

const getScoreMeta = (score: number) => {
  if (score > 69) {
    return {
      from: 'from-green-100',
      icon: '/icons/ats-good.svg',
      tone: 'Good fit',
    } as const;
  }
  if (score > 49) {
    return {
      from: 'from-yellow-100',
      icon: '/icons/ats-warning.svg',
      tone: 'Decent fit',
    } as const;
  }
  return {
    from: 'from-red-100',
    icon: '/icons/ats-bad.svg',
    tone: 'Needs work',
  } as const;
};

const ATS: React.FC<AtsProps> = ({ score, suggestions }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const meta = getScoreMeta(clamped);

  return (
    <div
      className={`w-full rounded-xl shadow-md bg-gradient-to-br ${meta.from} to-white border border-gray-200 overflow-hidden`}
    >
      {/* Top section */}
      <div className="flex items-center gap-4 p-5 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <img
          src={meta.icon}
          alt="ATS score status"
          className="h-10 w-10"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900">
            ATS Score - {clamped}/100
          </h2>
          <p className="text-sm text-gray-600">{meta.tone}</p>
        </div>
      </div>

      {/* Description and suggestions */}
      <div className="p-6 pt-5">
        <h3 className="text-base font-medium text-gray-900 mb-1">How your resume stacks up</h3>
        <p className="text-sm text-gray-600 mb-4">
          Below are highlights and opportunities our ATS detected. Use these tips to
          strengthen alignment with job descriptions and improve recruiter visibility.
        </p>

        <ul className="space-y-2 mb-4">
          {suggestions.map((s, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <img
                src={s.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'}
                alt={s.type === 'good' ? 'Good' : 'Improve'}
                className="mt-0.5 h-5 w-5"
              />
              <span className="text-sm text-gray-800">{s.tip}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-700">
          Keep iterating—small improvements can have a big impact on your ATS score.
        </p>
      </div>
    </div>
  );
};

export default ATS;