import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { TrainingReportsHeader } from "../../components/UI/TrainingReportsUi/TrainingReportsHeader";
import { TrainingReportsGrid } from "../../components/UI/TrainingReportsUi/TrainingReportsGrid";
import { DeleteTrainingReportModal } from "../../components/UI/TrainingReportsUi/DeleteTrainingReportModal";

import { useTrainingReports } from "../../hooks/useTrainingReports";
import type { TrainingReportSummary } from "../../types/Types";

export const TrainingReports = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [reportToDelete, setReportToDelete] =
    useState<TrainingReportSummary | null>(null);

  const {
    reports,
    isLoadingReports,
    reportsError,
    deletingReportId,
    fetchReports,
    deleteReport,
  } = useTrainingReports();

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const filteredReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return reports;
    }

    return reports.filter((report) => {
      return (
        report.leaderName
          .toLowerCase()
          .includes(term) ||
        report.id.toString().includes(term) ||
        report.trainingType
          .toLowerCase()
          .includes(term)
      );
    });
  }, [reports, searchTerm]);

  const handleViewDetails = (id: number) => {
    navigate(`/reportes-entrenamientos/ver/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(
      `/reportes-entrenamientos/editar/${id}`,
    );
  };

  const handleDelete = (id: number) => {
    if (deletingReportId !== null) {
      return;
    }

    const selectedReport = reports.find(
      (currentReport) => currentReport.id === id,
    );

    if (!selectedReport) {
      toast.error(
        "No se encontró el reporte seleccionado.",
      );

      return;
    }

    setReportToDelete(selectedReport);
  };

  const handleCancelDelete = () => {
    if (deletingReportId !== null) {
      return;
    }

    setReportToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (
      !reportToDelete ||
      deletingReportId !== null
    ) {
      return;
    }

    const deleted = await deleteReport(
      reportToDelete.id,
    );

    if (deleted) {
      setReportToDelete(null);
    }
  };

  return (
    <>
      <div
        className="
          mx-auto min-h-screen w-full max-w-7xl
          p-4 font-sans text-slate-900 md:p-6
        "
      >
        <TrainingReportsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {reportsError && (
          <div
            className="
              mb-6 flex flex-col gap-4 rounded-2xl
              border border-rose-200 bg-rose-50 p-4
              text-rose-800 sm:flex-row sm:items-center
            "
          >
            <div className="flex grow items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-semibold">
                {reportsError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchReports()}
              disabled={isLoadingReports}
              className="
                flex items-center justify-center gap-2
                rounded-xl border border-rose-300
                bg-white px-4 py-2 text-sm font-bold
                transition-colors hover:cursor-pointer
                hover:bg-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={16}
                className={
                  isLoadingReports
                    ? "animate-spin"
                    : ""
                }
              />

              Reintentar
            </button>
          </div>
        )}

        {isLoadingReports ? (
          <div
            className="
              flex min-h-72 flex-col items-center
              justify-center gap-3 rounded-3xl
              border border-slate-200 bg-white
              text-slate-400 shadow-sm
            "
          >
            <Loader2
              size={36}
              className="animate-spin text-blue-600"
            />

            <p className="text-sm font-bold">
              Cargando reportes de entrenamiento...
            </p>
          </div>
        ) : (
          <TrainingReportsGrid
            data={filteredReports}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingReportId={deletingReportId}
          />
        )}
      </div>

      <DeleteTrainingReportModal
        report={reportToDelete}
        isDeleting={
          deletingReportId !== null &&
          deletingReportId === reportToDelete?.id
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};