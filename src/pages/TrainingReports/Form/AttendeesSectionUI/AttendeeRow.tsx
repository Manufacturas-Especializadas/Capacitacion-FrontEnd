import { Trash2, CheckCircle2, Pen } from "lucide-react";
import type { ChangeEvent } from "react";

interface AttendeeRowProps {
  attendee: any;
  trainingType: string;
  days: { key: string; label: string }[];
  topicName?: string;
  onChange: (
    id: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onRemove: (id: string) => void;
  onOpenSignature: (
    id: string,
    field: "traineeSignature" | "supervisorSignature",
    name: string,
  ) => void;
}

export const AttendeeRow = ({
  attendee,
  trainingType,
  days,
  topicName,
  onChange,
  onRemove,
  onOpenSignature,
}: AttendeeRowProps) => {
  return (
    <tr className="hover:bg-blue-50/30 transition-colors group">
      <td className="border border-slate-200 p-0 bg-slate-50/50">
        <div
          className="w-full h-full p-2.5 text-slate-500 font-mono text-xs 
          cursor-not-allowed"
        >
          {attendee.employeeNumber}
        </div>
      </td>
      <td className="border border-slate-200 p-0 bg-slate-50/50">
        <div
          className="w-full h-full p-2.5 text-slate-700 font-semibold 
          truncate cursor-not-allowed"
        >
          {attendee.name}
        </div>
      </td>
      <td className="border border-slate-200 p-0 bg-slate-50/50">
        <div
          className="w-full h-full p-2.5 text-slate-600 text-xs 
          truncate cursor-not-allowed"
        >
          {attendee.line}
        </div>
      </td>

      {trainingType === "FABRICACION" && (
        <td className="border border-slate-200 p-0">
          <input
            type="text"
            name="shift"
            value={attendee.shift || ""}
            onChange={(e) => onChange(attendee.id, e)}
            className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
            focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
          />
        </td>
      )}

      {days.map((day) => (
        <td
          key={day.key}
          className="border border-slate-200 p-0 text-center align-middle"
        >
          <div className="flex items-center justify-center w-full h-full min-h-10">
            <input
              type="checkbox"
              name={day.key}
              checked={attendee[day.key] || false}
              onChange={(e) => {
                const fakeEvent = {
                  target: { name: day.key, value: e.target.checked },
                } as unknown as ChangeEvent<HTMLInputElement>;
                onChange(attendee.id, fakeEvent);
              }}
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 
              rounded cursor-pointer"
            />
          </div>
        </td>
      ))}

      {trainingType === "EMPAQUE" && (
        <td className="border border-slate-200 p-0">
          <input
            type="text"
            name="customerClient"
            value={attendee.customerClient || ""}
            onChange={(e) => onChange(attendee.id, e)}
            className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
            focus:ring-inset focus:ring-blue-500 text-slate-700"
          />
        </td>
      )}

      {trainingType === "SOLDADURA" && (
        <>
          <td className="border border-slate-200 p-0">
            <input
              type="text"
              name="unionClassification"
              value={attendee.unionClassification || ""}
              onChange={(e) => onChange(attendee.id, e)}
              className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
              focus:ring-inset focus:ring-blue-500 text-slate-700"
            />
          </td>
          <td className="border border-slate-200 p-0">
            <input
              type="text"
              name="weldingPercentage"
              value={attendee.weldingPercentage || ""}
              onChange={(e) => onChange(attendee.id, e)}
              className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
              focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
            />
          </td>
          <td className="border border-slate-200 p-0">
            <input
              type="text"
              name="diameter"
              value={attendee.diameter || ""}
              onChange={(e) => onChange(attendee.id, e)}
              className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
              focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
            />
          </td>
        </>
      )}

      {trainingType === "FABRICACION" && (
        <>
          <td className="border border-slate-200 p-0">
            <input
              type="text"
              name="machinery"
              value={attendee.machinery || ""}
              onChange={(e) => onChange(attendee.id, e)}
              className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
              focus:ring-inset focus:ring-blue-500 text-slate-700"
            />
          </td>
          <td className="border border-slate-200 p-0">
            <input
              type="text"
              name="ast"
              value={attendee.ast || ""}
              onChange={(e) => onChange(attendee.id, e)}
              className="w-full h-full p-2.5 bg-transparent outline-none focus:ring-2 
              focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
            />
          </td>
        </>
      )}

      <td className="border border-slate-200 p-0 bg-slate-50/50">
        <div
          className="w-full h-full p-2.5 text-slate-600 text-xs truncate cursor-not-allowed"
          title={topicName}
        >
          {attendee.topicCode}
        </div>
      </td>

      <td className="border border-slate-200 p-2 text-center align-middle">
        {attendee.traineeSignature ? (
          <div className="text-emerald-600 flex flex-col items-center gap-1">
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-bold">Firmado</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              onOpenSignature(attendee.id, "traineeSignature", attendee.name)
            }
            className="text-slate-400 hover:text-blue-600 flex flex-col items-center 
            gap-1 transition-colors mx-auto hover:cursor-pointer"
          >
            <Pen size={18} />
            <span className="text-[10px]">Firmar</span>
          </button>
        )}
      </td>

      <td className="border border-slate-200 p-2 text-center align-middle">
        {attendee.supervisorSignature ? (
          <div className="text-emerald-600 flex flex-col items-center gap-1">
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-bold">Firmado</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              onOpenSignature(attendee.id, "supervisorSignature", attendee.name)
            }
            className="text-slate-400 hover:text-blue-600 flex flex-col items-center 
            gap-1 transition-colors mx-auto hover:cursor-pointer"
          >
            <Pen size={18} />
            <span className="text-[10px]">Firmar</span>
          </button>
        )}
      </td>

      <td className="border border-slate-200 p-0 text-center align-middle bg-slate-50">
        <button
          type="button"
          onClick={() => onRemove(attendee.id)}
          className="p-2 text-slate-300 hover:text-rose-600 transition-colors mx-auto 
          block hover:cursor-pointer"
          title="Eliminar registro"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};
