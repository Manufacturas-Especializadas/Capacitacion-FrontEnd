import type { TopicEvaluation } from "../../types/Types";

interface TopicCellProps {
  evaluation: TopicEvaluation;
  onToggleStatus: () => void;
  onChangeGrade: (val: number | "") => void;
}
export const TopicCell = ({
  evaluation,
  onToggleStatus,
  onChangeGrade,
}: TopicCellProps) => {
  const isEnrolled = evaluation.isEnrolled !== false;
  const getStatusConfig = () => {
    if (!isEnrolled) return { style: "bg-slate-100 text-slate-300", icon: "-" };

    switch (evaluation.status) {
      case "PRESENT":
        return {
          style: "bg-emerald-100 text-emerald-700 font-black",
          icon: "•",
        };
      case "ABSENT":
        return { style: "bg-rose-100 text-rose-700 font-bold", icon: "X" };
      case "TARDY":
        return { style: "bg-amber-100 text-amber-700 font-bold", icon: "R" };
      default:
        return { style: "bg-slate-50 text-transparent", icon: "-" };
    }
  };

  const config = getStatusConfig();

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChangeGrade("");
      return;
    }

    const num = Number(val);
    if (num >= 0 && num <= 100) {
      onChangeGrade(num);
    }
  };
  return (
    <td className="p-1 border border-slate-300 min-w-22.5">
      <div className="flex items-center h-12 gap-1">
        <button
          onClick={onToggleStatus}
          disabled={!isEnrolled}
          className={`flex-1 h-full rounded flex items-center justify-center text-xl transition-colors 
          ${isEnrolled ? "active:scale-95 cursor-pointer" : "cursor-not-allowed opacity-60"} 
          ${config.style}`}
        >
          {config.icon}
        </button>
        <input
          type="number"
          min="0"
          max="100"
          value={evaluation.grade ?? ""}
          onChange={handleGradeChange}
          disabled={!isEnrolled}
          placeholder="-"
          className={`flex-1 h-full w-full rounded border border-slate-200 text-center text-sm font-medium 
          focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors
          ${isEnrolled ? "bg-white text-slate-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
        />
      </div>
    </td>
  );
};
