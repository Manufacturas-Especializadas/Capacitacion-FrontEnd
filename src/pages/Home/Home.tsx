import {
  Flame,
  LayoutDashboard,
  Users,
  FileBarChart,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModuleCard } from "../../components/ModuleCard/ModuleCard";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 
      selection:text-blue-900"
    >
      <div
        className="bg-white border-b border-slate-200 px-6 py-12 md:py-16 mb-8 
        text-center"
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center justify-center p-3 bg-blue-50 
            rounded-2xl mb-4 text-blue-600"
          >
            <LayoutDashboard size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Portal de Capacitación MESA
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium">
            Selecciona el módulo al que deseas ingresar para gestionar las
            asistencias o realizar evaluaciones operativas en piso.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ModuleCard
            title="Control de Asistencias"
            description="Crea listas de asistencia, gestiona firmas digitales de operadores y calcula métricas de aprobación para cursos de capacitación."
            icon={<Users size={28} strokeWidth={2} />}
            colorTheme="blue"
            onClick={() => navigate("/historial-registro-de-asistencia")}
          />

          <ModuleCard
            title="Checklist de Soldadores"
            description="Realiza evaluaciones técnicas en piso, verifica el equipo de protección y califica las habilidades prácticas del personal de soldadura."
            icon={<Flame size={28} strokeWidth={2} />}
            colorTheme="orange"
            onClick={() => navigate("/historial-checklist-soldadores")}
          />

          <ModuleCard
            title="Reporte de Entrenamiento"
            description="Visualiza estadísticas, genera reportes de cumplimiento y exporta datos consolidados sobre el avance de la capacitación en planta."
            icon={<FileBarChart size={28} strokeWidth={2} />}
            colorTheme="green"
            onClick={() => navigate("/reporte-entrenamiento")}
          />

          <ModuleCard
            title="Gestión de Empleados"
            description="Administra el catálogo de personal, actualiza departamentos, líneas de producción y mantén el censo operativo al día."
            icon={<UsersRound size={28} strokeWidth={2} />}
            colorTheme="purple"
            onClick={() => navigate("/gestion-empleados")}
          />
        </div>
      </div>
    </div>
  );
};
