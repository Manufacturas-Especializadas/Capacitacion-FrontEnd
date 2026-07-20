import {
  Calendar,
  Pencil,
  Trash2,
  User,
  Users,
  Building2,
  Star,
} from "lucide-react";
import type { TutoringProgramModel } from "../../../types/Types";

interface Props {
  tutoring: TutoringProgramModel;
}

export const TutoringCard = ({ tutoring }: Props) => {
  return (
    <div
      className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm 
      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {tutoring.collaboratorName}
          </h2>

          <p className="text-sm text-gray-500">#{tutoring.payrollNumber}</p>
        </div>

        <div className="rounded-full bg-blue-100 p-3">
          <User className="text-blue-600" size={22} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-gray-600">
          <Building2 size={18} />

          {tutoring.area}
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Users size={18} />

          {tutoring.tutor}
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Calendar size={18} />

          {tutoring.week}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-gray-500">Adaptación</p>

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={20}
              className={
                index < tutoring.adaptation
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 
          py-3 text-white transition hover:bg-blue-700 hover:cursor-pointer"
        >
          <Pencil size={18} />
          Editar
        </button>

        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border 
          border-red-300 py-3 text-red-600 transition hover:bg-red-50 hover:cursor-pointer"
        >
          <Trash2 size={18} />
          Eliminar
        </button>
      </div>
    </div>
  );
};
