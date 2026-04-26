import { useMemo, useState } from "react";
import ProblemStatement from "../ProblemTab/ProblemStatement";
import DiscussionTab from "../ProblemTab/DiscussionTab";
import SolutionsTab from "../ProblemTab/SolutionsTab";
import SubmissionsTab from "../ProblemTab/SubmissionsTab";

const tabs = [
  { key: "problem", label: "문제" },
  { key: "submissions", label: "제출 내역" },
  { key: "solutions", label: "정답 코드" },
  { key: "discussion", label: "토론" },
];

export default function ProblemPane() {
  const [active, setActive] = useState("problem");

  const Content = useMemo(() => {
    if (active === "problem") return <ProblemStatement />;
    if (active === "submissions") return <SubmissionsTab />;
    if (active === "solutions") return <SolutionsTab />;
    return <DiscussionTab />;
  }, [active]);

  return (
    <div className="h-full flex flex-col">
      {/* Tabs header */}
      <div className="flex border-b bg-white">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={[
              "px-3 py-2 text-sm",
              active === t.key
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500 hover:text-black",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{Content}</div>
    </div>
  );
}
