import { ProgramCard } from "../../components/UI/TutoringProgramUI/ProgramCard";
import { ProgramHeader } from "../../components/UI/TutoringProgramUI/ProgramHeader";
import type { TutoringProgramListDto } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import { useTutoringPrograms } from "../../hooks/useTutoringPrograms";

export const TutoringProgram = () => {
  const { programs, fetchPrograms, deleteProgram } = useTutoringPrograms();
  const navigate = useNavigate();

  const handleDetails = (id: number) => {
    navigate(`/programa-tutoreo/detalles/${id}`);
  };

  const handleCreate = () => {
    navigate("/programa-tutoreo/formulario");
  };

  const handleEdit = (id: number) => {
    navigate(`/programa-tutoreo/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este registro?",
    );

    if (confirmDelete) {
      const success = await deleteProgram(id);
      if (success) {
        fetchPrograms();
      }
    }
  };
  const handleFollowUp = (program: TutoringProgramListDto) => {
    navigate("/programa-tutoreo/formulario", {
      state: { prefillData: program },
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <ProgramHeader onCreateClick={handleCreate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFollowUp={handleFollowUp}
            onDetails={handleDetails}
          />
        ))}

        {programs.length === 0 && (
          <div
            className="col-span-full py-12 text-center text-gray-500 bg-gray-50 
            rounded-xl border-2 border-dashed border-gray-200"
          >
            No hay programas de tutoreo registrados aún.
          </div>
        )}
      </div>
    </div>
  );
};
