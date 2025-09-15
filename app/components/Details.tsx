import React from "react";
import { cn } from "~/lib/format";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "./Accordion";

// Local helper types for this file
type Tip = {
  type: "good" | "improve";
  tip: string;
  explanation: string;
};

// Helper component: ScoreBadge (local to this file)
const ScoreBadge = ({ score }: { score: number }) => {
  const tone = score > 69 ? "green" : score > 39 ? "yellow" : "red";

  const bg =
    tone === "green"
      ? "bg-green-100"
      : tone === "yellow"
      ? "bg-yellow-100"
      : "bg-red-100";

  const text =
    tone === "green"
      ? "text-green-700"
      : tone === "yellow"
      ? "text-yellow-700"
      : "text-red-700";

  const icon = (
    <svg
      className={cn("h-4 w-4", text)}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      {tone === "green" ? (
        // Check icon
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      ) : tone === "yellow" ? (
        // Minus icon
        <path
          fillRule="evenodd"
          d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      ) : (
        // Exclamation icon
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.346 11.285c.75 1.333-.213 2.99-1.743 2.99H3.654c-1.53 0-2.493-1.657-1.743-2.99L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        bg,
        text
      )}
    >
      {icon}
      <span>{score}/100</span>
    </span>
  );
};

// Helper component: CategoryHeader
const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

// Helper component: CategoryContent
const CategoryContent = ({ tips }: { tips: Tip[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Tips grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((t, idx) => {
          const isGood = t.type === "good";
          const iconCls = isGood ? "text-green-600" : "text-amber-600";
          return (
            <div key={idx} className="flex items-start gap-2">
              <svg
                className={cn("h-5 w-5 shrink-0 mt-0.5", iconCls)}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                {isGood ? (
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.5a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zM10 6.75a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0V7.5A.75.75 0 0010 6.75z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <p className="text-sm text-gray-700">{t.tip}</p>
            </div>
          );
        })}
      </div>

      {/* Explanations list */}
      <div className="flex flex-col gap-3">
        {tips.map((t, idx) => {
          const isGood = t.type === "good";
          return (
            <div
              key={`exp-${idx}`}
              className={cn(
                "rounded-lg border p-3 text-sm",
                isGood
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              )}
            >
              <p className="font-medium mb-1">
                {isGood ? "What you did well" : "How to improve"}
              </p>
              <p className="whitespace-pre-line">{t.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main component: Details
const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Detailed Feedback</h2>
        <p className="text-sm text-gray-500">Explore detailed suggestions for each category.</p>
      </div>

      <div className="p-2">
        <Accordion allowMultiple defaultOpen="tone" className="divide-y">
          {/* Tone & Style */}
          <AccordionItem id="tone">
            <AccordionHeader itemId="tone">
              <CategoryHeader
                title="Tone & Style"
                categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone">
              <CategoryContent tips={feedback.toneAndStyle.tips as Tip[]} />
            </AccordionContent>
          </AccordionItem>

          {/* Content */}
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader title="Content" categoryScore={feedback.content.score} />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips as Tip[]} />
            </AccordionContent>
          </AccordionItem>

          {/* Structure */}
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                title="Structure"
                categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips as Tip[]} />
            </AccordionContent>
          </AccordionItem>

          {/* Skills */}
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips as Tip[]} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Details;
