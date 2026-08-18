import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileText,
    Hash,
    Loader2,
    RefreshCcw,
    ShieldCheck,
    UserRound,
    Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { useTrainingReportDetails } from "../../../hooks/useTrainingReports";
import type { TrainingReportAttendeeDetails } from "../../../types/Types";

interface DetailItemProps {
    label: string;
    value: ReactNode;
    icon?: ReactNode;
}

const DetailItem = ({ label, value, icon }: DetailItemProps) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
                {icon}

                <span className="text-[11px] font-bold uppercase tracking-wider">
                    {label}
                </span>
            </div>

            <div className="wrap-break-word text-sm font-semibold text-slate-800">
                {value}
            </div>
        </div>
    );
};

interface SignatureCardProps {
    label: string;
    url: string | null;
}

const SignatureCard = ({ label, url }: SignatureCardProps) => {
    return (
        <div className="flex min-h-44 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                {label}
            </span>

            <div className="mt-4 flex flex-1 items-center justify-center">
                {url ? (
                    <img
                        src={url}
                        alt={label}
                        className="max-h-28 max-w-full object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ShieldCheck size={28} />

                        <span className="text-xs font-semibold">
                            Sin firma registrada
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

type TrainingReportTopicDetail =
    TrainingReportAttendeeDetails["topics"][number];


interface TopicDayColumn {
    shortLabel: string;
    fullLabel: string;

    isSelected: (
        topic: TrainingReportTopicDetail,
    ) => boolean;

    getHours: (
        topic: TrainingReportTopicDetail,
    ) => number | null;
}


const topicDayColumns: TopicDayColumn[] = [
    {
        shortLabel: "L",
        fullLabel: "Lunes",

        isSelected:
            (topic) => topic.dayMonday,

        getHours:
            (topic) => topic.hoursMonday,
    },
    {
        shortLabel: "M",
        fullLabel: "Martes",

        isSelected:
            (topic) => topic.dayTuesday,

        getHours:
            (topic) => topic.hoursTuesday,
    },
    {
        shortLabel: "X",
        fullLabel: "Miércoles",

        isSelected:
            (topic) => topic.dayWednesday,

        getHours:
            (topic) => topic.hoursWednesday,
    },
    {
        shortLabel: "J",
        fullLabel: "Jueves",

        isSelected:
            (topic) => topic.dayThursday,

        getHours:
            (topic) => topic.hoursThursday,
    },
    {
        shortLabel: "V",
        fullLabel: "Viernes",

        isSelected:
            (topic) => topic.dayFriday,

        getHours:
            (topic) => topic.hoursFriday,
    },
    {
        shortLabel: "S",
        fullLabel: "Sábado",

        isSelected:
            (topic) => topic.daySaturday,

        getHours:
            (topic) => topic.hoursSaturday,
    },
    {
        shortLabel: "D",
        fullLabel: "Domingo",

        isSelected:
            (topic) => topic.daySunday,

        getHours:
            (topic) => topic.hoursSunday,
    },
];


const formatHours = (
    value: number | null,
): string => {
    if (value === null) {
        return "—";
    }

    return new Intl.NumberFormat(
        "es-MX",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        },
    ).format(value);
};

const formatDate = (value: string): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("es-MX", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(date);
};

export const TrainingReportDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const numericId = id ? Number(id) : Number.NaN;
    const validId =
        Number.isInteger(numericId) && numericId > 0
            ? numericId
            : null;

    const {
        report,
        isLoading,
        error,
        refetch,
    } = useTrainingReportDetails(validId);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="animate-spin" size={24} />

                    <span className="text-sm font-semibold">
                        Cargando reporte...
                    </span>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="mx-auto min-h-screen w-full max-w-4xl p-4 md:p-6">
                <button
                    type="button"
                    onClick={() => navigate("/reportes-entrenamientos")}
                    className="mb-6 flex cursor-pointer items-center gap-2 text-sm
          font-semibold text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    Regresar a reportes
                </button>

                <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
                    <AlertCircle
                        size={42}
                        className="mx-auto mb-4 text-rose-500"
                    />

                    <h1 className="text-xl font-bold text-slate-800">
                        No fue posible cargar el reporte
                    </h1>

                    <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                        {error ?? "El reporte solicitado no fue encontrado."}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mx-auto mt-6 flex cursor-pointer items-center gap-2
            rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white
            transition-colors hover:bg-blue-700"
                    >
                        <RefreshCcw size={17} />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-screen w-full max-w-7xl p-4 text-slate-900 md:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <button
                    type="button"
                    onClick={() => navigate("/reportes-entrenamientos")}
                    className="flex cursor-pointer items-center gap-2 text-sm
          font-semibold text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    Regresar a reportes
                </button>

                <span className="self-start rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs font-bold text-slate-500 sm:self-auto">
                    ID: #{report.id}
                </span>
            </div>

            <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                                <FileText size={24} />
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                Detalles del Reporte
                            </h1>
                        </div>

                        <p className="text-sm text-slate-500">
                            Consulta la información registrada en este reporte de entrenamiento.
                        </p>
                    </div>

                    <span className="self-start rounded-xl bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-700 md:self-auto">
                        {report.trainingType}
                    </span>
                </div>
            </header>

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-800">
                    <UserRound size={20} className="text-blue-600" />
                    Información general
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem
                        label="Líder o instructor"
                        value={report.leaderName || "Sin información"}
                        icon={<UserRound size={16} />}
                    />

                    <DetailItem
                        label="Nómina del líder"
                        value={report.leaderPayroll || "Sin información"}
                        icon={<Hash size={16} />}
                    />

                    <DetailItem
                        label="Semana"
                        value={
                            report.weekNumber !== null
                                ? report.weekNumber
                                : "No especificada"
                        }
                        icon={<CalendarDays size={16} />}
                    />

                    <DetailItem
                        label="Fecha de creación"
                        value={formatDate(report.createdAt)}
                        icon={<CalendarDays size={16} />}
                    />
                </div>
            </section>

            {report.weldingUnionTypes.length > 0 && (
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-base font-bold text-slate-800">
                        Tipos de unión de soldadura
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {report.weldingUnionTypes.map((union) => (
                            <div
                                key={union.id}
                                className="rounded-xl border border-orange-200 bg-orange-50 p-4"
                            >
                                <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
                                    Lista {union.listNumber}
                                </p>

                                <p className="mt-1 font-semibold text-orange-900">
                                    {union.unionName}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                        <Users size={20} className="text-blue-600" />
                        Asistentes
                    </h2>

                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                        {report.attendees.length} registrados
                    </span>
                </div>

                {report.attendees.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
                        <Users
                            size={34}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="font-semibold text-slate-500">
                            Este reporte no tiene asistentes registrados
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {report.attendees.map((attendee, index) => {

                            return (
                                <article
                                    key={attendee.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200"
                                >
                                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                Asistente {index + 1}
                                            </p>

                                            <h3 className="mt-1 font-bold text-slate-800">
                                                {attendee.employeeName}
                                            </h3>
                                        </div>

                                        <span className="self-start rounded-lg bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-600 shadow-sm sm:self-auto">
                                            Nómina: {attendee.employeeNumber}
                                        </span>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            <DetailItem
                                                label="Línea"
                                                value={attendee.lineName}
                                            />

                                            <DetailItem
                                                label="Turno"
                                                value={attendee.shift || "No especificado"}
                                            />

                                            <DetailItem
                                                label="Maquinaria"
                                                value={attendee.machinery || "No especificada"}
                                            />

                                            <DetailItem
                                                label="AST"
                                                value={attendee.ast || "No especificada"}
                                            />
                                        </div>

                                        <div className="mt-5">
                                            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                                                Temas, días y horas
                                            </p>

                                            {attendee.topics.length > 0 ? (
                                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                                    <table className="w-full min-w-212.5 table-fixed border-collapse">
                                                        <colgroup>
                                                            <col className="w-[34%]" />

                                                            {topicDayColumns.map(
                                                                (day) => (
                                                                    <col
                                                                        key={day.fullLabel}
                                                                        className="w-[7%]"
                                                                    />
                                                                ),
                                                            )}

                                                            <col className="w-[10%]" />
                                                        </colgroup>

                                                        <thead>
                                                            <tr className="bg-slate-50">
                                                                <th
                                                                    scope="col"
                                                                    className="border-b border-r border-slate-200 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500"
                                                                >
                                                                    Tema
                                                                </th>

                                                                {topicDayColumns.map(
                                                                    (day) => (
                                                                        <th
                                                                            key={day.fullLabel}
                                                                            scope="col"
                                                                            title={
                                                                                day.fullLabel
                                                                            }
                                                                            className="border-b border-r border-slate-200 px-2 py-3 text-center"
                                                                        >
                                                                            <span className="block text-xs font-black text-slate-700">
                                                                                {
                                                                                    day.shortLabel
                                                                                }
                                                                            </span>

                                                                            <span className="mt-0.5 hidden text-[9px] font-semibold text-slate-400 xl:block">
                                                                                {
                                                                                    day.fullLabel
                                                                                }
                                                                            </span>
                                                                        </th>
                                                                    ),
                                                                )}

                                                                <th
                                                                    scope="col"
                                                                    className="border-b border-slate-200 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500"
                                                                >
                                                                    Total
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {attendee.topics.map(
                                                                (topic) => {
                                                                    const hasDailyHours =
                                                                        topicDayColumns.some(
                                                                            (day) =>
                                                                                day.getHours(
                                                                                    topic,
                                                                                ) !== null,
                                                                        );

                                                                    const hasSelectedDays =
                                                                        topicDayColumns.some(
                                                                            (day) =>
                                                                                day.isSelected(
                                                                                    topic,
                                                                                ),
                                                                        );

                                                                    const isHistorical =
                                                                        hasSelectedDays &&
                                                                        !hasDailyHours &&
                                                                        topic.totalHours !==
                                                                        null;

                                                                    return (
                                                                        <tr
                                                                            key={topic.id}
                                                                            className="last:[&>td]:border-b-0"
                                                                        >
                                                                            <td className="border-b border-r border-slate-200 px-4 py-3 align-middle">
                                                                                <p className="text-xs font-bold text-blue-700">
                                                                                    {
                                                                                        topic.topicCode
                                                                                    }
                                                                                </p>

                                                                                <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-700">
                                                                                    {
                                                                                        topic.topicName
                                                                                    }
                                                                                </p>
                                                                            </td>

                                                                            {topicDayColumns.map(
                                                                                (day) => {
                                                                                    const selected =
                                                                                        day.isSelected(
                                                                                            topic,
                                                                                        );

                                                                                    const hours =
                                                                                        day.getHours(
                                                                                            topic,
                                                                                        );

                                                                                    return (
                                                                                        <td
                                                                                            key={
                                                                                                day.fullLabel
                                                                                            }
                                                                                            className="border-b border-r border-slate-200 px-1 py-2 text-center align-middle"
                                                                                        >
                                                                                            {selected ? (
                                                                                                <div className="flex min-h-12 flex-col items-center justify-center gap-1">
                                                                                                    <CheckCircle2
                                                                                                        size={
                                                                                                            15
                                                                                                        }
                                                                                                        className="text-emerald-600"
                                                                                                    />

                                                                                                    <span className="whitespace-nowrap text-[11px] font-bold text-slate-700">
                                                                                                        {hours !==
                                                                                                            null
                                                                                                            ? `${formatHours(
                                                                                                                hours,
                                                                                                            )} h`
                                                                                                            : "—"}
                                                                                                    </span>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <span className="text-sm font-medium text-slate-300">
                                                                                                    —
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                    );
                                                                                },
                                                                            )}

                                                                            <td className="border-b border-slate-200 px-2 py-3 text-center align-middle">
                                                                                <span className="whitespace-nowrap text-sm font-black text-slate-800">
                                                                                    {topic.totalHours !==
                                                                                        null
                                                                                        ? `${formatHours(
                                                                                            topic.totalHours,
                                                                                        )} h`
                                                                                        : "—"}
                                                                                </span>

                                                                                {isHistorical && (
                                                                                    <span className="mx-auto mt-1 block w-fit rounded-md bg-amber-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-700">
                                                                                        Histórico
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                },
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                                    No hay temas registrados.
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <SignatureCard
                                                label="Firma del asistente"
                                                url={attendee.traineeSignatureUrl}
                                            />

                                            <SignatureCard
                                                label="Firma del supervisor"
                                                url={attendee.supervisorSignatureUrl}
                                            />
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-slate-800">
                    Observaciones
                </h2>

                <div className="min-h-24 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {report.observations?.trim() || "Sin observaciones registradas."}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-base font-bold text-slate-800">
                    Firmas de cierre
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SignatureCard
                        label="Instructor responsable"
                        url={report.instructorSignatureUrl}
                    />

                    <SignatureCard
                        label="Coordinación de capacitación"
                        url={report.coordinatorSignatureUrl}
                    />

                    <SignatureCard
                        label="Responsable de seguridad"
                        url={report.securitySignatureUrl}
                    />
                </div>
            </section>
        </div>
    );
};