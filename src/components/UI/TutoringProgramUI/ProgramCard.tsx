import {
  Edit2,
  Trash2,
  Calendar,
  Hash,
  MapPin,
  FastForward,
  Eye,
} from "lucide-react";
import type { TutoringProgramListDto } from "../../../types/Types";

interface ProgramCardProps {
  program: TutoringProgramListDto;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onFollowUp: (program: TutoringProgramListDto) => void;
  onDetails: (id: number) => void;
}

export const ProgramCard = ({
  program,
  onEdit,
  onDelete,
  onFollowUp,
  onDetails,
}: ProgramCardProps) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md 
      transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
            {program.collaboratorName}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Hash size={14} />
            <span>Nómina: {program.payrollNumber}</span>
          </div>
        </div>
        <span
          className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 
          rounded-full whitespace-nowrap"
        >
          Semana {program.weekId}
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-gray-400" />
          <span>{program.area}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>{new Date(program.createdDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={() => onFollowUp(program)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
          text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors
          hover:cursor-pointer"
          title={`Iniciar seguimiento para la Semana ${
            program.weekId < 4 ? program.weekId + 1 : "final"
          }`}
        >
          <FastForward size={16} />
          <span>Seguimiento</span>
        </button>
        <button
          onClick={() => onDetails(program.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg 
          transition-colors hover:cursor-pointer"
          title="Ver detalles"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => onEdit(program.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg 
          transition-colors hover:cursor-pointer"
          title="Editar"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(program.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg 
          transition-colors hover:cursor-pointer"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
