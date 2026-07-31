import { ProgramCard } from "../../components/UI/TutoringProgramUI/ProgramCard";
import { ProgramHeader } from "../../components/UI/TutoringProgramUI/ProgramHeader";
import type { TutoringProgramListDto } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import { useTutoringPrograms } from "../../hooks/useTutoringPrograms";
import { useAuth } from "../../context/AuthContext";
import { useMemo } from "react";

export const TutoringProgram = () => {
  const { programs, fetchPrograms, deleteProgram } = useTutoringPrograms();
  const { user } = useAuth();
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

  const filteredPrograms = useMemo(() => {
    if (!programs || !user) return [];

    if (user.role === "Administrador") {
      return programs;
    }

    const nominaToNameMap: Record<string, string> = {
      "2520": "Fausto Mariscal",
      "1626": "Gloria Guerra",
      "3788": "Iván Soto",
      "1279": "Luisa Sandoval",
      "4007": "Mary Rivera",
      "2426": "Nancy Martínez",
      "4774": "Zwitbee Torres",
      "5206": "Adriana Del Angel",
      "5071": "Maura Lopez",
      "0001": "Otoniel Zuñiga",
      "4173": "Irene Santiago",
    };

    const myTutorName = nominaToNameMap[user.payrollNumber];

    if (!myTutorName) return [];

    return programs.filter((program) => program.tutorName === myTutorName);
  }, [programs, user]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <ProgramHeader onCreateClick={handleCreate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFollowUp={handleFollowUp}
            onDetails={handleDetails}
          />
        ))}

        {filteredPrograms.length === 0 && (
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
