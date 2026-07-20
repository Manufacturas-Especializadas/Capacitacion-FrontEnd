import { Plus, GraduationCap } from "lucide-react";

interface TutoringHeaderProps {
  onCreate: () => void;
}

export const TutoringHeader = ({ onCreate }: TutoringHeaderProps) => {
  return (
    <div
      className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm border 
      border-gray-200 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <GraduationCap size={30} className="text-blue-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Programa de Tutoreo
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Seguimiento de adaptación de nuevos colaboradores.
          </p>
        </div>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 
        font-medium text-white transition hover:bg-blue-700 hover:cursor-pointer"
      >
        <Plus size={20} />
        Nuevo seguimiento
      </button>
    </div>
  );
};
