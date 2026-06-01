import type { Evaluation } from "../../types/Types";

interface TopicCellProps {
  evaluation: Evaluation;
  onToggleStatus: () => void;
  onChangeGrade: (val: number | "") => void;
}

export const TopicCell = ({
  evaluation,
  onToggleStatus,
  onChangeGrade,
}: TopicCellProps) => {
  const status = evaluation.status?.toUpperCase() || "EMPTY";

  const isAbsent = ["X", "ABSENT", "FALTA"].includes(status);
  const isPendingOrEmpty = ["EMPTY", "PENDING"].includes(status);
  const isLate = ["R", "LATE", "TARDY", "RETARDO"].includes(status);

  const getStatusButtonClass = () => {
    if (status === "PRESENT") return "bg-emerald-500 text-white";
    if (isLate) return "bg-amber-500 text-white font-bold";
    if (isAbsent) return "bg-rose-500 text-white font-bold";
    return "bg-slate-100 text-slate-300 hover:bg-slate-200";
  };

  return (
    <td className="p-2 border-r border-slate-300 text-center">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onToggleStatus}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all shadow-sm cursor-pointer select-none ${getStatusButtonClass()}`}
        >
          {status === "PRESENT" && "•"}
          {isLate && "R"}
          {isAbsent && "X"}
          {isPendingOrEmpty && "-"}
        </button>

        <input
          type="number"
          min="0"
          max="100"
          value={isAbsent || isPendingOrEmpty ? "" : (evaluation.grade ?? "")}
          onChange={(e) => {
            const val = e.target.value === "" ? "" : Number(e.target.value);
            onChangeGrade(val);
          }}
          disabled={isAbsent || isPendingOrEmpty}
          placeholder="-"
          className={`w-14 h-8 text-center text-sm font-semibold border rounded-lg outline-none transition-all ${
            isAbsent || isPendingOrEmpty
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed select-none"
              : "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
      </div>
    </td>
  );
};
