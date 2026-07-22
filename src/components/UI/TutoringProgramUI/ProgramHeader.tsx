import { Plus } from "lucide-react";

interface ProgramHeaderProps {
  onCreateClick: () => void;
}

export const ProgramHeader = ({ onCreateClick }: ProgramHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Programas de Tutoreo
        </h1>
        <p className="text-sm text-gray-500">
          Gestiona el seguimiento y adaptación de los colaboradores.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 
        py-2 rounded-lg font-medium transition-colors hover:cursor-pointer"
      >
        <Plus size={20} />
        <span>Nuevo Programa</span>
      </button>
    </div>
  );
};
