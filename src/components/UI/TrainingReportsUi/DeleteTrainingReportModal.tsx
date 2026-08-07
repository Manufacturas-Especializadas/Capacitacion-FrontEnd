import {
    AlertTriangle,
    Loader2,
    Trash2,
    X,
} from "lucide-react";

import type { TrainingReportSummary } from "../../../types/Types";

interface DeleteTrainingReportModalProps {
    report: TrainingReportSummary | null;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteTrainingReportModal = ({
    report,
    isDeleting,
    onCancel,
    onConfirm,
}: DeleteTrainingReportModalProps) => {
    if (!report) {
        return null;
    }

    const handleClose = () => {
        if (!isDeleting) {
            onCancel();
        }
    };

    return (
        <div
            className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-slate-950/50 p-4 backdrop-blur-sm
      "
            onMouseDown={handleClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-report-title"
                className="
          w-full max-w-md overflow-hidden rounded-3xl
          border border-slate-200 bg-white shadow-2xl
        "
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-2xl bg-rose-100 text-rose-600
              "
                        >
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <h2
                                id="delete-report-title"
                                className="text-lg font-black text-slate-900"
                            >
                                Eliminar reporte
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isDeleting}
                        aria-label="Cerrar modal"
                        className="
              rounded-xl p-2 text-slate-400 transition-colors
              hover:cursor-pointer hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed disabled:opacity-40
            "
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <div
                        className="
              rounded-2xl border border-rose-100
              bg-rose-50 p-4
            "
                    >
                        <p className="text-sm leading-6 text-slate-700">
                            Se eliminará el reporte{" "}
                            <strong className="font-black">
                                #{report.id}
                            </strong>{" "}
                            de{" "}
                            <strong className="font-black">
                                {report.trainingType}
                            </strong>
                            , junto con todos los registros que contiene.
                        </p>

                        <div className="mt-4 space-y-1">
                            <p className="text-xs font-semibold text-slate-500">
                                Responsable: {report.leaderName}
                            </p>

                            <p className="text-xs font-semibold text-slate-500">
                                Asistentes: {report.attendeesCount}
                            </p>

                            <p className="text-xs font-semibold text-slate-500">
                                Semana: {report.weekNumber ?? "No especificada"}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="
            flex flex-col-reverse gap-3 border-t
            border-slate-100 bg-slate-50 p-5
            sm:flex-row sm:justify-end
          "
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="
              rounded-xl border border-slate-200 bg-white
              px-5 py-2.5 text-sm font-bold text-slate-700
              transition-colors hover:cursor-pointer
              hover:bg-slate-100
              disabled:cursor-not-allowed disabled:opacity-50
            "
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={() => void onConfirm()}
                        disabled={isDeleting}
                        className="
              flex items-center justify-center gap-2
              rounded-xl bg-rose-600 px-5 py-2.5
              text-sm font-bold text-white transition-colors
              hover:cursor-pointer hover:bg-rose-700
              disabled:cursor-not-allowed disabled:opacity-60
            "
                    >
                        {isDeleting ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 size={18} />
                                Eliminar reporte
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};