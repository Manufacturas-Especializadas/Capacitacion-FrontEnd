import { useEffect, useState } from "react";
import { FormWelcome } from "./FormWelcome";
import { useCatalogs } from "../../hooks/useCatalogs";
import { useTutoringPrograms } from "../../hooks/useTutoringPrograms";
import { Loader2 } from "lucide-react";
import { DynamicForm } from "../../components/UI/TutoringProgramUI/DynamicForm";
import { useNavigate, useParams } from "react-router-dom";

export const CreateTutoringProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(!!id);

  const { data: formSections, loading: loadingQuestions } =
    useTutoringPrograms();
  const { tutors, lines, weeks, fetchAll, isLoadingCatalogs } = useCatalogs();

  useEffect(() => {
    if (id) {
      fetchAll();
    }
  }, [id]);

  const handleStart = async () => {
    setIsStarted(true);
    await fetchAll();
  };

  const handleCancel = () => {
    if (id) {
      navigate(-1);
    } else {
      setIsStarted(false);
    }
  };

  const isLoading = loadingQuestions || isLoadingCatalogs;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen">
      {!isStarted ? (
        <FormWelcome onStart={handleStart} />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">
            Preparando el entorno de evaluación...
          </p>
        </div>
      ) : (
        <DynamicForm
          sections={formSections}
          catalogs={{ tutors, lines, weeks }}
          programId={id ? Number(id) : undefined}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
