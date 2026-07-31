import {
  Flame,
  LayoutDashboard,
  Users,
  FileBarChart,
  UsersRound,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModuleCard } from "../../components/ModuleCard/ModuleCard";
import { useAuth } from "../../context/AuthContext";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modules = [
    {
      title: "Control de Asistencias",
      description:
        "Crea listas de asistencia, gestiona firmas digitales de operadores y calcula métricas de aprobación para cursos de capacitación.",
      icon: <Users size={28} strokeWidth={2} />,
      colorTheme: "blue",
      path: "/historial-registro-de-asistencia",
      allowedRoles: ["Administrador", "Instructor"],
    },
    {
      title: "Checklist de Soldadores",
      description:
        "Realiza evaluaciones técnicas en piso, verifica el equipo de protección y califica las habilidades prácticas del personal de soldadura.",
      icon: <Flame size={28} strokeWidth={2} />,
      colorTheme: "orange",
      path: "/historial-checklist-soldadores",
      allowedRoles: ["Administrador", "Evaluador"],
    },
    {
      title: "Reporte de Entrenamiento",
      description:
        "Visualiza estadísticas, genera reportes de cumplimiento y exporta datos consolidados sobre el avance de la capacitación en planta.",
      icon: <FileBarChart size={28} strokeWidth={2} />,
      colorTheme: "green",
      path: "/reportes-entrenamientos",
      allowedRoles: ["Administrador", "Entrenamiento"],
    },
    {
      title: "Gestión de Empleados",
      description:
        "Administra el catálogo de personal, actualiza departamentos, líneas de producción y mantén el censo operativo al día.",
      icon: <UsersRound size={28} strokeWidth={2} />,
      colorTheme: "purple",
      path: "/gestion-empleados",
      allowedRoles: ["Administrador"],
    },
    {
      title: "Programa de Tutoreo",
      description:
        "Seguimiento al personal nuevo. Asigna tutores, registra avances y evalúa el desarrollo durante el periodo de integración.",
      icon: <UserPlus size={28} strokeWidth={2} />,
      colorTheme: "teal",
      path: "/programa-tutoreo",
      allowedRoles: ["Administrador", "Tutor"],
    },
    {
      title: "Control de Usuarios",
      description:
        "Gestión de accesos, creación de cuentas y asignación de roles del portal.",
      icon: <ShieldCheck size={28} strokeWidth={2} />,
      colorTheme: "slate",
      path: "/usuarios",
      allowedRoles: ["Administrador"],
    },
  ];

  const visibleModules = modules.filter(
    (module) => user && module.allowedRoles.includes(user.role),
  );

  return (
    <div
      className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 
      selection:text-blue-900"
    >
      <div
        className="bg-white border-b border-slate-200/60 pt-12 pb-24 px-6 
        md:pt-20 md:pb-32 text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 
          bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-100/50 
          via-white to-white pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 
            text-slate-600 text-sm font-semibold mb-6 shadow-sm border border-slate-200/50"
          >
            <LayoutDashboard size={16} className="text-blue-500" />
            <span>Plataforma Operativa</span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 
            text-slate-900"
          >
            Portal de Capacitación{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 
              to-blue-400"
            >
              MESA
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-slate-500 font-medium max-w-2xl 
            leading-relaxed"
          >
            Selecciona el módulo al que deseas ingresar para gestionar las
            asistencias o realizar evaluaciones operativas en piso.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-20 -mt-12 md:-mt-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {visibleModules.map((module, index) => (
            <ModuleCard
              key={index}
              title={module.title}
              description={module.description}
              icon={module.icon}
              colorTheme={module.colorTheme as any}
              onClick={() => navigate(module.path)}
            />
          ))}
        </div>

        {visibleModules.length === 0 && (
          <div
            className="text-center py-10 text-slate-500 bg-white rounded-2xl border 
            border-slate-200 shadow-sm"
          >
            <ShieldCheck size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="font-semibold text-lg text-slate-700">
              Sin módulos asignados
            </p>
            <p>
              Tu rol actual ({user?.role}) no tiene permisos para visualizar
              ninguna sección.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
